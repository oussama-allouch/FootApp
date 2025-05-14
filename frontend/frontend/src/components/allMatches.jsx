"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "../assets/styles/matches.css"

const AllMatches = () => {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/matches")
      .then((response) => {
        setMatches(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des matchs :", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="all-matches-page">
      <h2 className="page-title">Tous les matchs disponibles</h2>
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Chargement des matchs...</span>
        </div>
      ) : (
        <div className="matches-grid">
          {matches.map((match) => (
            <div key={match.id} className="match-card">
              <div className="match-header">
                <span className="date">
                  {new Date(match.date_heure).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </span>
                <span className="time">
                  {new Date(match.date_heure).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="teams">
                <span className="team home">{match.equipe1}</span>
                <span className="vs">VS</span>
                <span className="team away">{match.equipe2}</span>
              </div>

              <div className="match-details">
                <div className="stadium">
                  <i className="icon-location"></i>
                  <span>{match.stade?.nom || "Stade non spécifié"}</span>
                </div>
                <div className="seats">
                  <i className="icon-seat"></i>
                  <span>
                    {match.stade?.capacite
                      ? `${match.stade.capacite - (match.reserved_seats || 0)} places restantes`
                      : "Capacité non disponible"}
                  </span>
                </div>
              </div>

              <Link
                to={`/matches/${match.id}`}
                className={`book-btn ${
                  match.stade?.capacite && match.stade.capacite - (match.reserved_seats || 0) <= 0 ? "disabled" : ""
                }`}
                aria-disabled={match.stade?.capacite && match.stade.capacite - (match.reserved_seats || 0) <= 0}
              >
                {match.stade?.capacite && match.stade.capacite - (match.reserved_seats || 0) <= 0
                  ? "Complet"
                  : "Réserver un billet"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllMatches
