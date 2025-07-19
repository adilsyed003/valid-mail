package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"github.com/adilsyed003/email-validator/models"
)
type DNSResponse struct {
	Answer []struct {
		Data string `json:"data"`
	} `json:"Answer"`
}
var client = &http.Client{}
func FetchDNS(domain string,record string) []string{
	url :=fmt.Sprintf("https://dns.google/resolve?name=%s&type=%s", domain, record)
	resp,err:=client.Get(url)
	if err != nil {
		log.Printf("Error fetching DNS record for %s: %v\n", domain, err)
		return nil
	}
	defer resp.Body.Close()
	contentType := resp.Header.Get("Content-Type")
    if !strings.Contains(contentType, "application/json") {
        log.Printf("DNS API returned non-JSON content type '%s' for %s\n", contentType, domain)
        return nil
    }

	var result DNSResponse
	if err:=json.NewDecoder(resp.Body).Decode(&result);err!=nil{
		log.Printf("Error decoding DNS response for %s: %v\n", domain, err)
		return nil
	}
	var records []string
	for _,answer := range result.Answer{
		records=append(records,answer.Data)
	}
	return records
}
func AnalyzeEmail(email string) models.EmailAnalysis{
	domain := strings.Split(email, "@")[1]
	var wg sync.WaitGroup
	var MXRecord, SPFRecord, DMARCRecord []string
	wg.Add(3)
	go func(){
		defer wg.Done()
		MXRecord = FetchDNS(domain,"MX")
	}()
	go func(){
		defer wg.Done()
		SPFRecord = FetchDNS(domain,"TXT")
	}()
	go func(){
		defer wg.Done()
		DMARCRecord = FetchDNS("_dmarc."+domain,"TXT")
	}()
	wg.Wait()
	hasMX := len(MXRecord)>0
	hasSPF, spfRecord := extractSPF(SPFRecord)
	hasDMARC, dmarcRecord := extractDMARC(DMARCRecord)
	isDisposable := IsDisposableEmail(email)
	MXGEO := GetMXGeoLocation(MXRecord)
	isSafe := hasMX && hasSPF && hasDMARC && !isDisposable
	verdict := "Safe and authenticated email domain"
	if !hasMX {
		verdict = "Domain cannot receive email (no MX)"
		isSafe = false
	} else if isDisposable {
		verdict = "Disposable/temporary email domain"
		isSafe = false
	} else if !hasSPF || !hasDMARC {
		verdict = "Email domain lacks proper authentication"
		isSafe = false
	}

	return models.EmailAnalysis{
		Email:        email,
		Domain:       domain,
		HasMX:        hasMX,
		HasSPF:       hasSPF,
		HasDMARC:     hasDMARC,
		MXRecord:     strings.Join(MXRecord, ", "),
		SPFRecord:    spfRecord,
		DMARCRecord:  dmarcRecord,
		IsDisposable: isDisposable,
		IsSafe:       isSafe,
		Verdict:      verdict,
		MXGEO:      MXGEO,
	}

}
func extractSPF(records []string) (bool, string) {
	for _,record:=range records{
		if strings.HasPrefix(record,"\"v=spf1") || strings.HasPrefix(record,"v=spf1") {
			return true, record

		}
	}
	return false, ""
}
func extractDMARC(records []string) (bool, string) {
	for _,record:=range records{
		if strings.HasPrefix(record,"\"v=DMARC1") || strings.HasPrefix(record,"v=DMARC1") {
			return true, record
		}
	}
	return false, ""
}
func IsDisposableEmail(email string) bool {
	disposableDomains := []string{"mailinator.com", "10minutemail.com", "guerrillamail.com"}
	domain := strings.Split(email, "@")[1]
	for _, d := range disposableDomains {
		if strings.EqualFold(d, domain) {
			return true
		}
	}
	return false
}