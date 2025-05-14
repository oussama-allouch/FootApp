"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import "../assets/styles/MatchesDetails.css"

const MatchDetails = () => {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedMatches, setRelatedMatches] = useState([])

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/matches/${id}`)
        setMatch(response.data)

        // Simuler le chargement de matchs liés (à remplacer par votre API réelle)
        const relatedResponse = await axios.get(`http://127.0.0.1:8000/api/matches`)
        // Filtrer pour exclure le match actuel et limiter à 3 matchs
        const filtered = relatedResponse.data.filter((m) => m.id !== Number.parseInt(id)).slice(0, 3)
        setRelatedMatches(filtered)

        setLoading(false)
      } catch (err) {
        console.error("Erreur lors du chargement des détails du match:", err)
        setError("Impossible de charger les détails du match")
        setLoading(false)
      }
    }

    fetchMatchDetails()
  }, [id])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des détails du match...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>{error}</p>
        <Link to="/" className="back-button">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <p>Match non trouvé</p>
        <Link to="/" className="back-button">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  const matchDate = new Date(match.date_heure)
  const now = new Date()
  const isUpcoming = matchDate > now
  const availableSeats = match.stade?.capacite - (match.billets?.reduce((sum, b) => sum + b.place, 0) || 0)

  return (
    <div className="match-details-page">
      <header className="match-details-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </span>
          Retour aux matchs
        </Link>
        <h1>Détails du match</h1>
      </header>

      <section className="match-hero">
        <div className="match-hero-bg"></div>
        <div className="match-hero-content">
          <div className="match-date">{formatDate(match.date_heure)}</div>

          <div className="match-teams-display">
            <div className="team-display home-team">
              <div className="team-logo-large">{match.equipe1.charAt(0)}</div>
              <div className="team-name">{match.equipe1}</div>
            </div>

            <div className="match-score">
              <div className="score-display">-</div>
              <div className="score-separator">:</div>
              <div className="score-display">-</div>
            </div>

            <div className="team-display away-team">
              <div className="team-logo-large">{match.equipe2.charAt(0)}</div>
              <div className="team-name">{match.equipe2}</div>
            </div>
          </div>

          <div className={`match-status ${isUpcoming ? "status-upcoming" : "status-finished"}`}>
            {isUpcoming ? "À venir" : "Terminé"}
          </div>
        </div>
      </section>

      <section className="match-info-section">
        <div className="info-card">
          <h3>Informations</h3>
          <ul className="info-list">
            <li className="info-item">
              <span className="info-icon calendar-icon"></span>
              <span className="info-text">{formatDate(match.date_heure)}</span>
            </li>
            <li className="info-item">
              <span className="info-icon time-icon"></span>
              <span className="info-text">{formatTime(match.date_heure)}</span>
            </li>
            <li className="info-item">
              <span className="info-icon stadium-icon"></span>
              <span className="info-text">{match.stade?.nom || "Stade non spécifié"}</span>
            </li>
            <li className="info-item">
              <span className="info-icon ticket-icon"></span>
              <span className="info-text">{availableSeats} places disponibles</span>
            </li>
          </ul>
        </div>

        <div className="info-card">
          <h3>Météo</h3>
          <ul className="info-list">
            <li className="info-item">
              <span className="info-icon weather-icon"></span>
              <span className="info-text">Ensoleillé, 22°C</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="stadium-section">
        <h2>Stade</h2>
        <div className="stadium-info">
          <img src="/placeholder.svg?height=300&width=500" alt={match.stade?.nom} className="stadium-image" />
          <div className="stadium-details">
            <h3 className="stadium-name">{match.stade?.nom || "Stade non spécifié"}</h3>
            <p className="stadium-address">123 Rue du Stade, 75000 Paris</p>
            <div className="stadium-capacity">
              <span className="capacity-icon"></span>
              <span className="capacity-text">Capacité: {match.stade?.capacite || "Non spécifiée"}</span>
            </div>
            <p className="stadium-description">
              Ce stade moderne offre une expérience exceptionnelle aux spectateurs avec une vue imprenable sur le
              terrain depuis chaque siège. Équipé des dernières technologies, il garantit une ambiance électrique lors
              des matchs.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Réservez vos places maintenant</h2>
        <p>
          Ne manquez pas ce match exceptionnel entre {match.equipe1} et {match.equipe2}. Réservez vos billets dès
          maintenant pour vivre l'expérience en direct !
        </p>
        <div className="cta-buttons">
          <Link to={`/matches/${match.id}/tickets`} className="cta-button cta-primary">
            Acheter des billets
          </Link>
          <Link to="/matches" className="cta-button cta-secondary">
            Voir d'autres matchs
          </Link>
        </div>
      </section>

      {relatedMatches.length > 0 && (
        <section className="related-matches">
          <h2>Autres matchs à venir</h2>
          <div className="related-matches-grid">
            {relatedMatches.map((relatedMatch) => (
              <div key={relatedMatch.id} className="related-match-card">
                <div className="related-match-header">
                  <span className="related-match-date">{formatDate(relatedMatch.date_heure)}</span>
                  <span className="related-match-time">{formatTime(relatedMatch.date_heure)}</span>
                </div>

                <div className="related-match-teams">
                  <span className="related-team related-home-team">{relatedMatch.equipe1}</span>
                  <span className="related-vs">VS</span>
                  <span className="related-team related-away-team">{relatedMatch.equipe2}</span>
                </div>

                <div className="related-match-footer">
                  <Link to={`/matches/${relatedMatch.id}`} className="view-details-btn">
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default MatchDetails
