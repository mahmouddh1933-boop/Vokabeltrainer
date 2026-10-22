# حروف من الزيتون · Auf Firebase veröffentlichen

Das vorbereitete Hosting-Paket gehört zum Firebase-Projekt **letters-from-olive**.
Es enthält Registrierung, Anmeldung mit E-Mail/Passwort, Passwort-Zurücksetzen,
Abmelden und eine Synchronisierung gespeicherter Lernstände über Cloud Firestore. Analytics wird nicht initialisiert.

## 1. Anmeldung im Firebase-Projekt aktivieren

1. Öffne https://console.firebase.google.com/ und das Projekt **letters-from-olive**.
2. Wähle **Build → Authentication → Sign-in method**.
3. Aktiviere **E-Mail/Passwort** und speichere. „E-Mail-Link“ ist nicht erforderlich.
4. Prüfe unter **Authentication → Settings → Authorized domains**, dass
   `letters-from-olive.web.app` und `letters-from-olive.firebaseapp.com` eingetragen sind.
5. Wähle bei Bedarf unter **Authentication → Templates** die Sprache und den
   Absendernamen für Passwort-Zurücksetzen. Firebase stellt die E-Mail-Aktionsseite bereit.

Bleibe beim kostenlosen Spark-Tarif. Authentication, Hosting und eine Standard-Firestore-Datenbank
können innerhalb ihrer kostenlosen Kontingente verwendet werden. Cloud Functions und
Cloud Storage werden nicht benötigt. Speicherungen werden gebündelt und unveränderte
Datensätze aus einem lokalen Cache geladen, um Lese- und Schreibzugriffe zu begrenzen.
Die kostenlosen Kontingente sind keine Zusicherung unbegrenzter Nutzung.

## 2. Cloud Firestore aktivieren

1. Öffne im selben Projekt **Build → Firestore Database → Datenbank erstellen**.
2. Wähle **Standard Edition** und die Datenbank-ID **(default)**.
3. Wähle eine passende Region, beispielsweise **europe-west3 (Frankfurt)** für
   Lernende in Deutschland. Der Standort wird bei der Erstellung festgelegt.
4. Starte im **Produktionsmodus**. Das nachfolgende Deployment richtet die
   privaten Zugriffsregeln ein. Wenn die Datenbank bereits existiert, verwende sie weiter.

Die Datei `firestore.rules` erlaubt jedem angemeldeten Konto ausschließlich den
Zugriff auf seine eigenen Lernstände. Die Regeln gehören zusammen mit der App
zum Deployment. Stelle die Datenbank nicht auf öffentliches Lesen/Schreiben.

## 3. Node.js installieren

Installiere die aktuelle **LTS-Version** von https://nodejs.org/.
Öffne danach ein neues Terminal bzw. unter Windows die **Eingabeaufforderung**.

```sh
node --version
npm --version
npm install -g firebase-tools
```

## 4. Hosting-Paket vollständig entpacken

Entpacke **Huroof-Firebase.zip**. Im darin enthaltenen Ordner **Huroof-Firebase**
müssen `firebase.json`, `firestore.rules`, `.firebaserc` und der Ordner `firebase-public` liegen.
Öffne ein Terminal genau in diesem Ordner. Unter Windows: Ordner im Explorer öffnen,
oben in die Adresszeile `cmd` eingeben und Enter drücken.

Für dieses vorbereitete Paket musst du **weder Python installieren noch
`firebase init` ausführen**. Die Hosting-Dateien sind bereits vollständig gebaut.

## 5. Mit deinem Google-Konto anmelden und hochladen

```sh
firebase login
firebase deploy --only "firestore:rules,hosting" --project letters-from-olive
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

Gespeicherte Ergebnisse, Wortlisten, Wiederholungslisten, Buchaufgaben, Entwürfe
und Einstellungen werden unter der jeweiligen Firebase-Benutzer-ID in Cloud
Firestore synchronisiert. Auf einem zweiten Gerät genügt die Anmeldung mit demselben
Konto. Sprach- und Hintergrundpräferenzen werden ebenfalls übernommen.

Unter **Mein Konto** zeigt die App den Synchronisierungsstatus. „Synchronisiert“
bedeutet, dass alle aktuell erfassten Änderungen bestätigt wurden. Fehlt die
Verbindung, bleiben Änderungen in einer lokalen Warteschlange und werden beim
nächsten Verbinden oder Öffnen erneut übertragen. Lösche bis zur Bestätigung keine
Browserdaten. Bei einem neuen Kontologin werden bestehende lokale Kontodaten
zusammengeführt; Daten aus dem separat heruntergeladenen file://-Offline-Paket
werden nicht automatisch auf die Website übertragen.

Auf bereits geöffneten Lernseiten erscheint bei Änderungen von einem anderen
Gerät **Speichern und übernehmen**. Die Schaltfläche überträgt eigene Änderungen
und lädt die Seite anschließend neu. Dadurch bleiben laufende Eingaben erhalten,
bis du den neuen Stand bewusst übernimmst. Beim nächsten Seitenwechsel werden die
Cloud-Daten automatisch geladen. Bei paralleler Arbeit an verschiedenen Fragen
werden die Antworten zusammengeführt. Für dasselbe geänderte Feld gilt die zuletzt
in der Cloud gespeicherte Änderung. Vorher nicht dauerhaft gespeicherte, flüchtige
Übungssitzungen werden durch die Synchronisierung nicht automatisch zu gespeicherten Aufgaben.

Anfragen enthalten nur die freigegebenen Lern- und Einstellungsschlüssel.
Firebase-Anmeldetokens, Passwörter und laufende Sitzungsschlüssel werden nicht als
Lerndaten hochgeladen. Eine Metadaten-Abfrage erkennt geänderte Datensätze;
Speicherungen erfolgen gesammelt nach einer kurzen Pause. Einzelne Datensätze
über 600.000 UTF-8-Bytes bleiben lokal und werden mit einem Statushinweis gemeldet.

Die herunterladbare Offline-App funktioniert weiterhin ohne Konto. Firebase-Hosting
liefert öffentliche statische Lerninhalte aus; die Anmeldung steuert den Zugang zur
Lernoberfläche, sie macht die HTML-, Audio- und Bilddateien nicht zu privaten Dateien.
Persönliche Lernstände liegen in der durch `firestore.rules` geschützten Datenbank.

## Für Entwicklung und Tests aus dem Repository

Für die lokalen Emulator-Tests wird zusätzlich Java 21 oder neuer benötigt.
Der Repository-Deploy baut `firebase-public` per Python 3 vorab. Der öffentliche
Ordner enthält nur die App und ihre benötigten Assets: keine Git-Dateien, Tests,
Werkzeuge, Original-Uploads oder Download-Archive.

```sh
python3 tools/build-hosting.py
firebase emulators:start --only auth,firestore,hosting --project letters-from-olive
```

Öffne für den lokalen Test http://127.0.0.1:5000/. Auf diesem Port verbindet sich
die App ausschließlich mit dem lokalen Auth-Emulator auf Port 9099 und Firestore auf Port 8080. Es werden dabei
keine Konten im echten Firebase-Projekt erstellt. Testkonten und Emulator-E-Mails
sind nur lokal vorhanden. Normale Entwicklung auf Port 8000 und `file://` bleiben
ohne Firebase-Anmeldung nutzbar.

```sh
python3 tests/firebase-auth-smoke.py
python3 tests/firebase-sync-smoke.py
python3 tools/build-download.py
python3 tools/build-hosting.py --archive
```

Bei einer späteren eigenen Domain muss sie zu `js/firebase-config.js` und zu
Firebase Authentication → Authorized domains hinzugefügt werden. Weitere
Firebase-Hosting-Sites mit anderen Namen benötigen ebenfalls einen passenden Host-Eintrag.
