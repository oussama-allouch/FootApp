"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import "../assets/styles/home.css"

const Home = () => {
  const [user, setUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [popularMatches, setPopularMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem("token")
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user)
          setAuthChecked(true)
        })
        .catch(() => {
          logout()
          setAuthChecked(true)
        })
    } else {
      setAuthChecked(true)
    }

    // Charger les données des matchs
    loadMatchesData()
  }, [])

  const loadMatchesData = () => {
    axios
      .all([axios.get("http://127.0.0.1:8000/api/matches"), axios.get("http://127.0.0.1:8000/api/popular")])
      .then(
        axios.spread((matchesRes, popularRes) => {
          setMatches(matchesRes.data)
          setPopularMatches(popularRes.data)
          setLoading(false)
        })
      )
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  const logout = () => {
    axios
      .post("http://127.0.0.1:8000/api/logout")
      .then(() => {
        localStorage.removeItem("token")
        setUser(null)
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion:", error)
        localStorage.removeItem("token")
        setUser(null)
      })
  }

  // Afficher un loader pendant la vérification de l'authentification
  if (!authChecked) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <img src="/logo.png" alt="FootballTickets" />
          </Link>

          <div className="navbar-links">
            <Link to="/">Accueil</Link>
            <Link to="/matches">Matchs</Link>
            <Link to="/tickets">Billets</Link>

            {/* Section authentification améliorée */}
            <div className="auth-section">
              {user ? (
                <>
                  <Link to="/profile" className="profile-link">
                    <span className="username">{user.name}</span>
                    <img src={user.avatar || "/default-avatar.png"} alt="Profil" className="user-avatar" />
                  </Link>
                  <button onClick={logout} className="logout-btn" aria-label="Déconnexion">
                    <i className="icon-logout"></i>
                    <span>Déconnexion</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="auth-link" aria-label="Connexion">
                    <i className="icon-login"></i>
                    <span>Connexion</span>
                  </Link>
                  <Link to="/register" className="auth-link primary" aria-label="Inscription">
                    <i className="icon-register"></i>
                    <span>Inscription</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
        </div>
        <div className="hero-content">
          <h1>Vivez l'émotion du football</h1>
          <p>Réservez vos places pour les plus grands matchs dès maintenant !</p>
          <Link to="/matches" className="cta-button">
            Voir les matchs
          </Link>
        </div>
      </section>

      {/* Popular Matches Slider */}
      <section className="popular-matches">
        <h2 className="section-title">Matchs populaires</h2>
        <div className="matches-slider">
          {popularMatches.map((match) => (
            <div key={match.id} className="match-slide">
              <div className="slide-content">
                <div className="teams">
                  <span className="home-team">{match.equipe1}</span>
                  <span className="vs">VS</span>
                  <span className="away-team">{match.equipe2}</span>
                </div>
                <div className="match-info">
                  <span>{new Date(match.date_heure).toLocaleDateString()}</span>
                  <span>{match.stade.nom}</span>
                </div>
                <Link to={`/matches/${match.id}`} className="book-btn" state={{ matchId: match.id }}>
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="upcoming-matches">
        <h2 className="section-title">Prochains matchs</h2>
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <span>Chargement des matchs...</span>
          </div>
        ) : (
          <div className="matches-grid">
            {matches.map((match) => (
              <div key={match.id} className="match-card">
                {/* En-tête avec date et heure */}
                <div className="match-header">
                  <span className="date">
                    {new Date(match.date_heure).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span className="time">
                    {new Date(match.date_heure).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Affichage des équipes */}
                <div className="teams">
                  <span className="team home">{match.equipe1}</span>
                  <span className="vs">VS</span>
                  <span className="team away">{match.equipe2}</span>
                </div>

                {/* Détails du match */}
                <div className="match-details">
                  <div className="stadium">
                    <i className="icon-location"></i>
                    <span>{match.stade?.nom || "Stade non spécifié"}</span>
                  </div>

                  {/* Calcul des places restantes optimisé */}
                  <div className="seats">
                    <i className="icon-seat"></i>
                    <span>
                      {match.stade?.capacite
                        ? `${match.stade.capacite - (match.reserved_seats || 0)} places restantes`
                        : "Capacité non disponible"}
                    </span>
                  </div>
                </div>

                {/* Bouton de réservation avec gestion d'état */}
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
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="section-title">Pourquoi choisir notre plateforme ?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-shield"></i>
            </div>
            <h3>Paiements sécurisés</h3>
            <p>Transactions cryptées et protégées pour une réservation en toute confiance</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-qrcode"></i>
            </div>
            <h3>Billets numériques</h3>
            <p>QR code unique directement sur votre smartphone pour un accès rapide</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className="icon-clock"></i>
            </div>
            <h3>Réservation instantanée</h3>
            <p>Accès immédiat aux places disponibles en temps réel</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">Ce que disent nos utilisateurs</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="quote">"Rapide et efficace, j'ai eu mes places pour le classique en 2 minutes !"</div>
            <div className="author">
              <img src="/user1.jpg" alt="Jean D." />
              <div className="info">
                <span className="name">Jean D.</span>
                <div className="stars">★★★★★</div>
              </div>
            </div>
          </div>
          {/* Ajoutez d'autres témoignages */}
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Restez informé</h2>
        <p>Abonnez-vous pour recevoir les annonces des futurs matchs</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Votre email" required />
          <button type="submit">S'abonner</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>FootballTickets</h3>
            <p>Votre billetterie officielle pour les matchs de football</p>
          </div>

          <div className="footer-section">
            <h4>Liens utiles</h4>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/terms">Conditions générales</Link>
          </div>

          <div className="footer-section">
            <h4>Réseaux sociaux</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="icon-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="icon-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="icon-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2023 FootballTickets. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home