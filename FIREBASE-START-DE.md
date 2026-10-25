# حروف من الزيتون · kostenlos mit Firebase Spark

Diese Ausgabe benötigt kein Zahlungsmittel, keine Cloud Functions und keine kostenpflichtigen Identity-Platform-Blocking-Funktionen. Verwendet werden E-Mail/Passwort-Anmeldung, Hosting und eine Standard-Firestore-Datenbank innerhalb der kostenlosen Spark-Kontingente. Bei ausgeschöpften Kontingenten können Dienste zeitweise ausfallen. Dies ist kein unbegrenztes Hosting-Angebot.

Die ausführliche arabische Anleitung mit technischen Grenzen steht in `ADMIN-SETUP-AR.md`.

## 1. Bestehendes Projekt weiterverwenden

Öffne https://console.firebase.google.com/ und das Projekt `letters-from-olive`.
Bleibe beim Spark-Tarif. Keine Zahlungsmethode hinzufügen und nicht auf Blaze wechseln.

Aktiviere Authentication → Sign-in method → Email/Password und prüfe unter Settings → Authorized domains die Hosting-Domains. Verwende die vorhandene Standard-Firestore-Datenbank `(default)`; lösche keine Konten oder Lernstände. Falls noch keine Datenbank besteht, erstelle sie im Produktionsmodus.

Wenn bereits kostenpflichtige Funktionen der vorherigen Ausgabe veröffentlicht wurden, müssen diese und die Blocking-Function-Verknüpfungen gesondert entfernt sowie der Tarif geprüft werden. Das Hochladen dieses Pakets löscht keine bestehenden Funktionen oder Abrechnungsdienste automatisch.

## 2. Paket entpacken und Werkzeuge installieren

Entpacke die neue `Huroof-Firebase.zip` in einen neuen Ordner. Bewahre die alte Version als Sicherung auf.
Im neuen Ordner müssen `firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`, `firebase-public` und `verification` liegen.

Installiere Node.js 22 oder neuer kompatibel, Java 21 für den Regeltest und die Firebase CLI:

```sh
npm install -g firebase-tools
firebase login
```

Öffne das Terminal im entpackten Ordner. Unter Windows im Explorer in der Adressleiste `cmd` eingeben. Für das fertige Paket sind Python und `firebase init` nicht erforderlich.

## 3. Offizielle Datenbankregeln testen

```sh
npm ci --prefix verification
firebase emulators:exec --only firestore --project demo-huroof-access "npm run test:rules --prefix verification"
```

`verification` enthält ausschließlich lokale Testwerkzeuge; daraus wird kein Server bereitgestellt. Erst nach erfolgreichem Regeltest veröffentlichen. Der offizielle Emulator-Download war in der Entwicklungsumgebung mit HTTP 403 gesperrt. Die dortigen Browser-/Protokolltests ersetzen diesen Regeltest nicht.

## 4. Website und Regeln veröffentlichen

```sh
firebase deploy --only "firestore,hosting" --project letters-from-olive
```

Nicht mit `--only functions` veröffentlichen. Diese Ausgabe benötigt weder einen Admin-Konfigurationsbefehl noch eine `.env`-Datei.

## 5. Einmalig die Administration einrichten

1. Öffne https://letters-from-olive.web.app/ und melde dich mit deinem eigenen Konto an oder registriere es.
2. Bestätige deine E-Mail-Adresse und wähle anschließend „Erneut prüfen“. Vor der Rollenvergabe kann noch eine fehlende Freigabe angezeigt werden.
3. Kopiere in Firebase Console → Authentication → Users die **User UID** deines Kontos.
4. Erstelle in Firestore → Data die Collection `oliveFreeAdmins`.
5. Verwende als Document ID genau diese UID, nicht deine E-Mail-Adresse.
6. Füge das Feld `enabled` vom Typ **boolean** mit Wert **true** hinzu und speichere.
7. Lade die Website neu. Die Verwaltung erscheint im Menü; direkt erreichbar unter https://letters-from-olive.web.app/admin.html.

Nur der Projektinhaber vergibt diese Rolle über die Console. Die Website kann keine Administratorrolle erstellen. Keine Schüler-UID als Administrator eintragen.

## 6. Lernende freischalten und Geräte verstehen

Füge in der Verwaltung die E-Mail-Adressen hinzu, auch die bereits bestehender Konten. Lernende müssen ihre E-Mail-Adresse bestätigen. Wiederholte Freigaben löschen keine Lernstände.

Die Datenbankregeln schützen die E-Mail-Freigabe und die Trennung der Kontodaten. Eine gesperrte E-Mail verliert beim nächsten geschützten Datenbankzugriff ihren Zugriff. Ein Authentifizierungskonto kann auch ohne Freigabe erstellt werden; es öffnet dann keine Lektionen oder Kontodaten.

Die Zwei-Browser-Grenze und das Sperren eines Browsereintrags sind **kooperative Funktionen der App-Oberfläche, keine sichere Gerätesperre**. Ein geteiltes Konto kann diese Geräteprüfung über eine alternative Oberfläche umgehen, weil der Firebase-Token kein bestimmtes Gerät beweist. Um den Datenbankzugriff des Kontos zu entziehen, sperre die E-Mail-Freigabe. Ein Browserprofil zählt als eigener Eintrag, mehrere Tabs desselben Browsers als ein Eintrag. Aktivitätsangaben sind vom Browser gemeldete Näherungen.

## 7. PWA und gespeicherte Daten

Nach erfolgreicher Prüfung kann eine gemerkte Sitzung gespeicherte Lektionen bis zu 24 Stunden offline öffnen. Für Verwaltung und Synchronisierung ist Internet erforderlich. Heruntergeladene statische Dateien können nicht zurückgerufen werden; dies ist kein DRM. Die Firebase-SDKs werden lokal mitgeliefert. Antworten bleiben bei vorübergehendem Verbindungsausfall lokal erhalten und werden bei erlaubtem Zugriff später synchronisiert.

Bei einer Fehlermeldung den genauen Text weitergeben, keine Passwörter oder Dienstkontoschlüssel teilen.
