"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import "../assets/styles/UserTicketsPage.css"

const UserTicketsPage = () => {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserTickets = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Vous devez être connecté pour voir vos billets")
        setLoading(false)
        return
      }

      try {
        // Récupérer l'ID utilisateur depuis localStorage
        const userInfo = localStorage.getItem("user")
        let userId

        if (userInfo) {
          try {
            const parsedUser = JSON.parse(userInfo)
            userId = parsedUser.id
            setUser(parsedUser)
          } catch (e) {
            setError("Impossible de récupérer vos informations utilisateur")
            setLoading(false)
            return
          }
        } else {
          setError("Impossible de récupérer vos informations utilisateur")
          setLoading(false)
          return
        }

        // Récupérer les billets de l'utilisateur
        const response = await axios.get(`http://127.0.0.1:8000/api/billets/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        setTickets(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des billets:", error)

        if (error.response) {
          setError(`Erreur: ${error.response.data.error || error.response.status}`)
        } else if (error.request) {
          setError("Aucune réponse du serveur. Vérifiez votre connexion.")
        } else {
          setError(`Erreur: ${error.message}`)
        }

        setLoading(false)
      }
    }

    fetchUserTickets()
  }, [])

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
        <p>Chargement de vos billets...</p>
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

  return (
    <div className="tickets-page">
      <header className="tickets-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span> Retour à l'accueil
        </Link>
        <h1>Mes Billets</h1>
      </header>

      {tickets.length === 0 ? (
        <div className="no-tickets">
          <div className="no-tickets-icon">🎫</div>
          <h2>Vous n'avez pas encore de billets</h2>
          <p>Explorez les matchs disponibles et réservez vos places dès maintenant !</p>
          <Link to="/" className="browse-button">
            Voir les matchs
          </Link>
        </div>
      ) : (
        <div className="tickets-container">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <div className="ticket-header">
                <div className="ticket-status" data-status={ticket.statut}>
                  {ticket.statut}
                </div>
                <div className="ticket-date">Acheté le {formatDate(ticket.created_at)}</div>
              </div>

              <div className="ticket-match-info">
                <div className="ticket-teams">
                  <span className="team home-team">{ticket.match.equipe1}</span>
                  <span className="vs">VS</span>
                  <span className="team away-team">{ticket.match.equipe2}</span>
                </div>

                <div className="ticket-details">
                  <div className="detail-item">
                    <span className="detail-icon date-icon"></span>
                    <span className="detail-text">{formatDate(ticket.match.date_heure)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon time-icon"></span>
                    <span className="detail-text">{formatTime(ticket.match.date_heure)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon stadium-icon"></span>
                    <span className="detail-text">{ticket.match.stade?.nom}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon seat-icon"></span>
                    <span className="detail-text">
                      {ticket.place} {ticket.place > 1 ? "places" : "place"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon price-icon"></span>
                    <span className="detail-text">{ticket.prix}€</span>
                  </div>
                </div>
              </div>

              <div className="ticket-actions">
                <a
                  href={`http://127.0.0.1:8000/api/billets/${ticket.id}/pdf`}
                  download={`ticket-${ticket.id}.pdf`}
                  className="download-button"
                >
                  <span className="btn-icon download-icon"></span>
                  Télécharger
                </a>

                <Link to={`/matches/${ticket.match_id}`} className="view-match-button">
                  <span className="btn-icon view-icon"></span>
                  Détails du match
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserTicketsPage
