package models

type EmailAnalysis struct {
	Email        string `json:"email"`
	Domain       string `json:"domain"`
	HasMX        bool   `json:"has_mx"`
	HasSPF       bool   `json:"has_spf"`
	HasDMARC     bool   `json:"has_dmarc"`
	MXRecord     string `json:"mx_record"`
	SPFRecord    string `json:"spf_record"`
	DMARCRecord  string `json:"dmarc_record"`
	IsDisposable bool   `json:"is_disposable"`
	IsSafe       bool   `json:"is_safe"`
	Verdict      string `json:"verdict"`
	MXGEO        string `json:"mx_geo"`
}