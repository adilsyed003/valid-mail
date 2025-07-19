package utils

import (
	"encoding/json"
	"fmt"
	"net"
	"strings"
)

type GeoResult struct {
	City    string `json:"city"`
	Region  string `json:"regionName"`
	Country string `json:"country"`
	IP      string `json:"query"`
}


func GetMXGeoLocation(mxRecords []string) string {
	if len(mxRecords) == 0 {
		return ""
	}

	// Split "14 alt2.gmail-smtp-in.l.google.com." into priority + hostname
	parts := strings.Fields(mxRecords[0])
	if len(parts) < 2 {
		return "invalid MX record format"
	}
	host := strings.TrimSuffix(parts[1], ".")

	ips, err := net.LookupIP(host)
	if err != nil || len(ips) == 0 {
		return "IP lookup failed"
	}
	ip := ips[0].String()

	url := fmt.Sprintf("http://ip-api.com/json/%s", ip)
	resp, err := client.Get(url)
	if err != nil {
		return "geo lookup error"
	}
	defer resp.Body.Close()

	var geo GeoResult
	if err := json.NewDecoder(resp.Body).Decode(&geo); err != nil {
		return "failed to decode geo data"
	}

	return fmt.Sprintf("%s, %s, %s (IP: %s)", geo.City, geo.Region, geo.Country, geo.IP)
}