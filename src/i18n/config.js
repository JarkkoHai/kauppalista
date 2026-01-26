import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Käännökset
const resources = {
  fi: {
    translation: {
      // LoginScreen
      login: {
        title: "Kauppalista Pro",
        subtitle: "Suunnittele ja jaa perheen kesken.",
        codeInput: "SYÖTÄ KOODI TAI JÄTÄ TYHJÄKSI",
        codeHelp: "Jätä tyhjäksi luodaksesi uuden listan tai syötä koodi liittyäksesi olemassa olevaan.",
        startButton: "ALOITA KÄYTTÖ",
        proButton: "Pro+ Kirjautuminen",
        email: "Sähköposti",
        password: "Salasana",
        rememberMe: "Muista minut tällä laitteella",
        loginButton: "KIRJAUDU SISÄÄN",
        googleButton: "Jatka Google-tilillä",
        or: "Tai",
        backButton: "Palaa takaisin",
        errors: {
          wrongPassword: "Väärä salasana. Yritä uudelleen.",
          weakPassword: "Salasanan tulee olla vähintään 6 merkkiä.",
          invalidEmail: "Virheellinen sähköpostiosoite.",
          registrationFailed: "Rekisteröinti epäonnistui. Yritä uudelleen.",
          loginFailed: "Kirjautuminen epäonnistui. Tarkista tiedot.",
          googleFailed: "Google-kirjautuminen epäonnistui.",
          cancelled: "Kirjautuminen peruutettu."
        }
      },
      
      // ShoppingListApp - lisätään myöhemmin
      app: {
        addItem: "Lisää uusi tuote...",
        shareCode: "Jaa ryhmäkoodi",
        clear: "Tyhjennä",
        logout: "Poistu ryhmästä",
        loading: "Ladataan...",
        emptyTitle: "Lista on tyhjä",
        emptySubtitle: "Lisää jotain yläpuolelta!",
        otherItems: "Muut ostokset",
        completed: "KERÄTYT"
      },
      
      // ShareModal - lisätään myöhemmin
      share: {
        title: "Kutsu tiimiisi",
        subtitle: "Muut voivat liittyä skanaamalla:",
        linkLabel: "Kutsu linkillä:",
        codeLabel: "tai koodilla:",
        copy: "Kopioi",
        copied: "Kopioitu!",
        whatsapp: "WhatsApp",
        close: "Sulje"
      }
    }
  },
  en: {
    translation: {
      // LoginScreen
      login: {
        title: "Shopping List Pro",
        subtitle: "Plan and share with your family.",
        codeInput: "ENTER CODE OR LEAVE EMPTY",
        codeHelp: "Leave empty to create a new list or enter a code to join an existing one.",
        startButton: "GET STARTED",
        proButton: "Pro+ Login",
        email: "Email",
        password: "Password",
        rememberMe: "Remember me on this device",
        loginButton: "SIGN IN",
        googleButton: "Continue with Google",
        or: "Or",
        backButton: "Go back",
        errors: {
          wrongPassword: "Wrong password. Try again.",
          weakPassword: "Password must be at least 6 characters.",
          invalidEmail: "Invalid email address.",
          registrationFailed: "Registration failed. Try again.",
          loginFailed: "Login failed. Check your credentials.",
          googleFailed: "Google sign-in failed.",
          cancelled: "Login cancelled."
        }
      },
      
      // ShoppingListApp
      app: {
        addItem: "Add new item...",
        shareCode: "Share group code",
        clear: "Clear",
        logout: "Leave group",
        loading: "Loading...",
        emptyTitle: "List is empty",
        emptySubtitle: "Add something above!",
        otherItems: "Other items",
        completed: "COMPLETED"
      },
      
      // ShareModal
      share: {
        title: "Invite to your team",
        subtitle: "Others can join by scanning:",
        linkLabel: "Invite with link:",
        codeLabel: "or with code:",
        copy: "Copy",
        copied: "Copied!",
        whatsapp: "WhatsApp",
        close: "Close"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fi', // Oletus suomi
    fallbackLng: 'fi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;