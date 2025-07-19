package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/adilsyed003/email-validator/utils"
)
type input struct{
	Email string `json:"email"`
}
func EmailValidatorHandler(w http.ResponseWriter, r *http.Request){
	var email input
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	err := json.NewDecoder(r.Body).Decode(&email)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	if email.Email == "" {
		http.Error(w, "Email cannot be empty", http.StatusBadRequest)
		return
	}
	log.Printf("Received email for validation: %s", email.Email)
	trimed:=strings.TrimSpace(strings.ToLower(email.Email))
	if !utils.IsValidEmail(trimed){
		http.Error(w, "Invalid email format", http.StatusBadRequest)
		return
	}
	result := utils.AnalyzeEmail(trimed)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}