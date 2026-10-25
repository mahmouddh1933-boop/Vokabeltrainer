(() => {
  "use strict";
  window.JisrStorage.ready(() => {
    const api = window.OliveAccess,
      $ = (id) => document.getElementById(id),
      de = () => window.AppLanguage?.get() === "de",
      t = (ar, german) => (de() ? german : ar);
    let rows = [],
      next = null,
      query = "",
      selected = null,
      busy = false,
      searchTimer,
      loadVersion = 0;
    const status = (text, error = false) => {
      $("admin-status").textContent = text;
      $("admin-status").classList.toggle("is-error", error);
    };
    function node(tag, text) {
      const e = document.createElement(tag);
      if (text !== undefined) e.textContent = text;
      return e;
    }
    function date(value) {
      return value
        ? new Intl.DateTimeFormat(de() ? "de-DE" : "ar", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(value))
        : t("لم يدخل بعد", "Noch keine Anmeldung");
    }
    function button(label, fn) {
      const b = node("button", label);
      b.type = "button";
      b.onclick = async () => {
        b.disabled = true;
        try {
          await fn();
        } catch (e) {
          showError(e);
        } finally {
          b.disabled = false;
        }
      };
      return b;
    }
    function showError(e) {
      const map = {
        PROTECTED_ADMIN: t(
          "حساب المدير محمي من التعطيل هنا.",
          "Das Administratorkonto ist hier vor Deaktivierung geschützt.",
        ),
        CURRENT_ADMIN_DEVICE: t(
          "لا يمكن إلغاء الجهاز الذي تدير منه الآن.",
          "Das aktuell verwendete Verwaltungsgerät kann hier nicht gesperrt werden.",
        ),
        INVALID_EMAIL: t(
          "أدخل بريدًا إلكترونيًا صالحًا.",
          "Gib eine gültige E-Mail-Adresse ein.",
        ),
      };
      status(
        map[e.code] ||
          t(
            "تعذّر إكمال العملية. تحقق من الاتصال والصلاحية ثم حاول مجددًا.",
            "Aktion fehlgeschlagen. Prüfe Verbindung und Berechtigung und versuche es erneut.",
          ),
        true,
      );
    }
    function render() {
      $("admin-members").replaceChildren();
      for (const row of rows) {
        const card = node("article");
        card.className = "admin-member";
        const title = node("h3"),
          mail = node("bdi", row.email);
        mail.dir = "ltr";
        title.append(mail);
        card.append(
          title,
          node(
            "p",
            (row.role === "admin"
              ? t("المدير", "Administration")
              : t("طالب", "Schüler")) +
              " · " +
              (row.enabled
                ? t("مسموح", "Freigegeben")
                : t("معطّل", "Gesperrt")),
          ),
          node(
            "p",
            t("الأجهزة المسجّلة: ", "Registrierte Geräte: ") +
              (de()?String(row.registeredDevices)+" von 2":String(row.registeredDevices).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d])+" من ٢"),
          ),
          node("p", t("آخر نشاط: ", "Zuletzt aktiv: ") + date(row.lastSeenAt)),
        );
        const actions = node("div");
        actions.className = "admin-actions";
        const devices = button(t("عرض الأجهزة", "Geräte anzeigen"), () =>
          loadDevices(row),
        );
        devices.disabled = !row.uid;
        actions.append(devices);
        if (row.role !== "admin")
          actions.append(
            button(
              row.enabled
                ? t("تعطيل السماح", "Freigabe sperren")
                : t("إعادة السماح", "Erneut freigeben"),
              async () => {
                await api.admin("adminSetEmail", {
                  email: row.email,
                  enabled: !row.enabled,
                });
                await load(false);
                if (selected?.uid === row.uid)
                  await loadDevices({ ...row, enabled: !row.enabled });
              },
            ),
          );
        else
          card.append(
            node(
              "p",
              t(
                "حساب الإدارة محمي من التعطيل داخل اللوحة.",
                "Dieses Administratorkonto kann hier nicht deaktiviert werden.",
              ),
            ),
          );
        card.append(actions);
        $("admin-members").append(card);
      }
      $("admin-more").hidden = !next;
    }
    async function load(more = false) {
      const version = ++loadVersion;
      busy = true;
      $("admin-refresh").disabled = true;
      status(t("جارٍ تحميل القائمة…", "Liste wird geladen …"));
      try {
        const result = await api.admin("adminListMembers", {
          limit: 30,
          after: more ? next : null,
          query,
        });
        if (version !== loadVersion) return;
        rows = more ? [...rows, ...result.rows] : result.rows;
        next = result.next;
        render();
        status(
          rows.length
            ? t("عدد الإيميلات المعروضة: ", "Angezeigte E-Mail-Adressen: ") +
                rows.length
            : t(
                "لا توجد إيميلات مطابقة. أضف البريد أولًا للسماح بالتسجيل.",
                "Keine passenden Einträge. Gib zuerst eine E-Mail-Adresse frei.",
              ),
        );
      } catch (e) {
        showError(e);
      } finally {
        busy = false;
        $("admin-refresh").disabled = false;
      }
    }
    async function loadDevices(row) {
      selected = row;
      const result = await api.admin("adminListDevices", { uid: row.uid });
      $("admin-device-panel").hidden = false;
      $("admin-device-title").textContent =
        t("أجهزة: ", "Geräte: ") + row.email;
      $("admin-devices").replaceChildren();
      if (!result.devices.length)
        $("admin-devices").append(
          node("p", t("لا توجد أجهزة مسجّلة.", "Keine Geräte registriert.")),
        );
      const own = window.OliveAuth.getUser(),
        ownClaims = await own.getIdTokenResult();
      for (const d of result.devices) {
        const card = node("article");
        card.className = "admin-member";
        card.append(
          node("h3", d.label),
          node("p", d.id.slice(0, 12)),
          node(
            "p",
            d.active
              ? t("مسجّل", "Registriert")
              : d.status === "revoked"
                ? t("أُلغي تسجيله", "Gesperrt")
                : t(
                    "متاح لإعادة التسجيل",
                    "Für erneute Registrierung freigegeben",
                  ),
          ),
          node("p", t("آخر نشاط: ", "Zuletzt aktiv: ") + date(d.lastSeenAt)),
          node(
            "p",
            t("تاريخ التسجيل: ", "Registriert seit: ") + date(d.createdAt),
          ),
        );
        if (d.recent)
          card.append(
            node(
              "p",
              t(
                "نشط خلال آخر خمس دقائق",
                "Innerhalb der letzten fünf Minuten aktiv",
              ),
            ),
          );
        const current =
          row.uid === own.uid && d.id === ownClaims.claims.oliveDevice;
        if (current) {
          const p = node("p", t("هذا جهازك الحالي", "Dein aktuelles Gerät"));
          p.className = "is-current";
          card.append(p);
        }
        const actions = node("div");
        actions.className = "admin-actions";
        const action = d.status === "revoked" ? "release" : "revoke";
        const b = button(
          action === "release"
            ? t("السماح بإعادة تسجيله", "Erneute Registrierung erlauben")
            : t("إلغاء تسجيل الجهاز", "Gerät sperren"),
          async () => {
            await api.admin("adminChangeDevice", {
              uid: row.uid,
              deviceId: d.id,
              action,
            });
            await loadDevices(row);
            await load(false);
          },
        );
        b.disabled = current;
        actions.append(b);
        card.append(actions);
        $("admin-devices").append(card);
      }
      $("admin-device-panel").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    $("admin-add").onsubmit = async (event) => {
      event.preventDefault();
      if (busy || !event.target.reportValidity()) return;
      $("admin-add-button").disabled = true;
      try {
        await api.admin("adminSetEmail", {
          email: $("admin-email").value.trim(),
          enabled: true,
        });
        $("admin-email").value = "";
        query = "";
        $("admin-search").value = "";
        await load(false);
      } catch (e) {
        showError(e);
      } finally {
        $("admin-add-button").disabled = false;
      }
    };
    $("admin-search").oninput = () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        query = $("admin-search").value.trim().toLowerCase();
        load(false);
      }, 350);
    };
    $("admin-refresh").onclick = () => load(false);
    $("admin-more").onclick = () => load(true);
    $("admin-close-devices").onclick = () => {
      $("admin-device-panel").hidden = true;
      selected = null;
    };
    window.addEventListener("app-language-change", () => {
      render();
      if (selected) loadDevices(selected);
    });
    if (!api?.enabled || !api.isAdmin()) {
      $("admin-add").hidden = true;
      $("admin-refresh").disabled = true;
      $("admin-search").disabled = true;
      status(
        t(
          "تحتاج هذه الصفحة إلى حساب مدير مسموح على نسخة Firebase المتصلة.",
          "Diese Seite benötigt ein freigegebenes Administratorkonto in der verbundenen Firebase-Ausgabe.",
        ),
        true,
      );
      return;
    }
    load(false);
  });
})();
