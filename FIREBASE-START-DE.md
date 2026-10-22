# حروف من الزيتون · Auf Firebase veröffentlichen

Das vorbereitete Hosting-Paket gehört zum Firebase-Projekt **letters-from-olive**.
Es enthält Registrierung, Anmeldung mit E-Mail/Passwort, Passwort-Zurücksetzen,
Abmelden und getrennte lokale Lernstände. Analytics wird nicht initialisiert.

## 1. Anmeldung im Firebase-Projekt aktivieren

1. Öffne https://console.firebase.google.com/ und das Projekt **letters-from-olive**.
2. Wähle **Build → Authentication → Sign-in method**.
3. Aktiviere **E-Mail/Passwort** und speichere. „E-Mail-Link“ ist nicht erforderlich.
4. Prüfe unter **Authentication → Settings → Authorized domains**, dass
   `letters-from-olive.web.app` und `letters-from-olive.firebaseapp.com` eingetragen sind.
5. Wähle bei Bedarf unter **Authentication → Templates** die Sprache und den
   Absendernamen für Passwort-Zurücksetzen. Firebase stellt die E-Mail-Aktionsseite bereit.

Bleibe beim kostenlosen Spark-Tarif. Für diese Veröffentlichung sind weder Cloud
Functions noch Cloud Storage, Firestore oder ein kostenpflichtiger Tarif erforderlich.
Die normalen Nutzungslimits der kostenlosen Firebase-Dienste gelten weiterhin.

## 2. Node.js installieren

Installiere die aktuelle **LTS-Version** von https://nodejs.org/.
Öffne danach ein neues Terminal bzw. unter Windows die **Eingabeaufforderung**.

```sh
node --version
npm --version
npm install -g firebase-tools
```

## 3. Hosting-Paket vollständig entpacken

Entpacke **Huroof-Firebase.zip**. Im darin enthaltenen Ordner **Huroof-Firebase**
müssen `firebase.json`, `.firebaserc` und der Ordner `firebase-public` liegen.
Öffne ein Terminal genau in diesem Ordner. Unter Windows: Ordner im Explorer öffnen,
oben in die Adresszeile `cmd` eingeben und Enter drücken.

Für dieses vorbereitete Paket musst du **weder Python installieren noch
`firebase init` ausführen**. Die Hosting-Dateien sind bereits vollständig gebaut.

## 4. Mit deinem Google-Konto anmelden und hochladen

```sh
firebase login
firebase deploy --only hosting --project letters-from-olive
```

Melde dich im Browser mit dem Google-Konto an, das Zugriff auf dieses Firebase-Projekt
hat. Falls das Terminal nach einer optionalen KI- oder Diagnosedaten-Funktion fragt,
ist diese für die Veröffentlichung nicht erforderlich.

Nach erfolgreichem Deploy gibt Firebase die Hosting-Adresse aus. Bei der
Standard-Website dieses Projekts lautet sie:

https://letters-from-olive.web.app/

Diese Adresse ist erst nach einem erfolgreichen Deploy die veröffentlichte App.
Teste dort **Neues Konto erstellen**, danach eine Übung, **Mein Konto → Abmelden**,
erneutes Anmelden und **Passwort vergessen?**. Auch ein direkter Link auf eine
Lernseite führt ohne Anmeldung zuerst zum Login und danach zurück zur gewünschten Seite.

## Was gespeichert wird

Firebase Authentication verwaltet Konten und Anmeldesitzungen. Passwörter werden
nicht von der Anwendung im Browser gespeichert. „Auf diesem Gerät angemeldet
bleiben“ ist zunächst aus: Ohne diese Auswahl endet die Sitzung beim Schließen
des Tabs. Mit der Auswahl bleibt die Anmeldung auf diesem Browser bestehen.

Lernstände werden auf diesem Browser nach Firebase-Benutzer-ID getrennt gespeichert.
Die Daten bleiben nach dem Abmelden erhalten und sind beim nächsten Login mit
demselben Konto auf diesem Browser wieder verfügbar. Eine geräteübergreifende
Synchronisierung ist in dieser Version **nicht** enthalten. Bereits vorhandene
Offline-Lernstände werden nicht automatisch auf die neue Website übertragen.

Die herunterladbare Offline-App funktioniert weiterhin ohne Konto. Firebase-Hosting
liefert öffentliche statische Lerninhalte aus; die Anmeldung steuert den Zugang zur
Lernoberfläche, sie macht die HTML-, Audio- und Bilddateien nicht zu privaten Dateien.
Es werden keine privaten Benutzerdaten in einer öffentlich zugänglichen Datenbank abgelegt.

## Für Entwicklung und Tests aus dem Repository

Der Repository-Deploy baut `firebase-public` per Python 3 vorab. Der öffentliche
Ordner enthält nur die App und ihre benötigten Assets: keine Git-Dateien, Tests,
Werkzeuge, Original-Uploads oder Download-Archive.

```sh
python3 tools/build-hosting.py
firebase emulators:start --only auth,hosting --project letters-from-olive
```

Öffne für den lokalen Test http://127.0.0.1:5000/. Auf diesem Port verbindet sich
die App ausschließlich mit dem lokalen Auth-Emulator auf Port 9099. Es werden dabei
keine Konten im echten Firebase-Projekt erstellt. Testkonten und Emulator-E-Mails
sind nur lokal vorhanden. Normale Entwicklung auf Port 8000 und `file://` bleiben
ohne Firebase-Anmeldung nutzbar.

```sh
python3 tests/firebase-auth-smoke.py
python3 tools/build-download.py
python3 tools/build-hosting.py --archive
```

Bei einer späteren eigenen Domain muss sie zu `js/firebase-config.js` und zu
Firebase Authentication → Authorized domains hinzugefügt werden. Weitere
Firebase-Hosting-Sites mit anderen Namen benötigen ebenfalls einen passenden Host-Eintrag.
