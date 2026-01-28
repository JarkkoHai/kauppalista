
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
        username: "Käyttäjätunnus", // ← MUUTA tämä (oli: email)
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
      share: {
        title: "Kutsu tiimiisi",
        subtitle: "Muut voivat liittyä skanaamalla:",
        linkLabel: "Kutsu linkillä:",
        codeLabel: "tai koodilla:",
        copy: "Kopioi",
        copied: "Kopioitu!",
        whatsapp: "WhatsApp",
        close: "Sulje"
      },
      sidebar: {
        title: "PRO-TYÖKALUT",
        quickAdd: "Pikalisäys",
        recipes: "Resepti-ideat",
        addIngredients: "Lisää {{count}} ainesta",
        anonymous: "Anonyymi",
        premiumMember: "Premium Jäsen",
        categories: {
          hevi: "HeVi",
          dairy: "Maitotuotteet",
          meat: "Liha & Proteiini"
        },
        items: {
          omena: "Omena",
          banaani: "Banaani",
          kurkku: "Kurkku",
          tomaatti: "Tomaatti",
          porkkana: "Porkkana",
          sipuli: "Sipuli",
          maito: "Maito",
          kaurajuoma: "Kaurajuoma",
          juusto: "Juusto",
          voi: "Voi",
          jogurtti: "Jogurtti",
          rahka: "Rahka",
          jauheliha: "Jauheliha",
          kanafilee: "Kanafilee",
          lohi: "Lohi",
          kananmuna: "Kananmuna",
          nakki: "Nakki",
          tomaattimurska: "Tomaattimurska",
          spagetti: "Spagetti",
          valkosipuli: "Valkosipuli",
          kana: "Kana",
          keittojuurekset: "Keittojuurekset",
          peruna: "Peruna",
          kanaliemikuutio: "Kanaliemikuutio",
          kerma: "Kerma",
          pasta: "Pasta",
          sitruuna: "Sitruuna",
          tilli: "Tilli"
        },
        recipeNames: {
          bolognese: "Bolognese",
          kanakeitto: "Kanakeitto",
          lohipasta: "Lohipasta"
        }
      }
    }
  },
  en: {
    translation: {
      login: {
        title: "Shopping List Pro",
        subtitle: "Plan and share with your family.",
        codeInput: "ENTER CODE OR LEAVE EMPTY",
        codeHelp: "Leave empty to create a new list or enter a code to join an existing one.",
        startButton: "GET STARTED",
        proButton: "Pro+ Login",
        username: "Username", // ← MUUTA tämä (oli: email)
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
      share: {
        title: "Invite to your team",
        subtitle: "Others can join by scanning:",
        linkLabel: "Invite with link:",
        codeLabel: "or with code:",
        copy: "Copy",
        copied: "Copied!",
        whatsapp: "WhatsApp",
        close: "Close"
      },
      sidebar: {
        title: "PRO TOOLS",
        quickAdd: "Quick Add",
        recipes: "Recipe Ideas",
        addIngredients: "Add {{count}} ingredients",
        anonymous: "Anonymous",
        premiumMember: "Premium Member",
        categories: {
          hevi: "Fruits & Veggies",
          dairy: "Dairy Products",
          meat: "Meat & Protein"
        },
        items: {
          omena: "Apple",
          banaani: "Banana",
          kurkku: "Cucumber",
          tomaatti: "Tomato",
          porkkana: "Carrot",
          sipuli: "Onion",
          maito: "Milk",
          kaurajuoma: "Oat drink",
          juusto: "Cheese",
          voi: "Butter",
          jogurtti: "Yogurt",
          rahka: "Quark",
          jauheliha: "Ground beef",
          kanafilee: "Chicken breast",
          lohi: "Salmon",
          kananmuna: "Egg",
          nakki: "Sausage",
          tomaattimurska: "Crushed tomatoes",
          spagetti: "Spaghetti",
          valkosipuli: "Garlic",
          kana: "Chicken",
          keittojuurekset: "Soup vegetables",
          peruna: "Potato",
          kanaliemikuutio: "Chicken stock cube",
          kerma: "Cream",
          pasta: "Pasta",
          sitruuna: "Lemon",
          tilli: "Dill"
        },
        recipeNames: {
          bolognese: "Bolognese",
          kanakeitto: "Chicken soup",
          lohipasta: "Salmon pasta"
        }
      }
    }
  }
};

let isInitialized = false;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fi', // ← Lue heti alussa
    fallbackLng: 'fi',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  }).then(() => {
    isInitialized = true;
  });

// Debug
i18n.on('languageChanged', (lng) => {
  console.log('🌍 Language changed to:', lng);
  // Tallenna LocalStorageen vain jos muutos tulee käyttäjältä
  if (isInitialized) {
    localStorage.setItem('language', lng);
  }
});

export default i18n;