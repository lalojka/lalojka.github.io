# V4 API EPM — Meta App Review Guide

Guía para grabar el screencast y completar el formulario de App Review de Meta.  
Permisos solicitados: `whatsapp_business_messaging` + `whatsapp_business_management` (Coexistence).

---

## Video script — 3 minutos (en inglés)

El video debe grabarse en inglés. Usá una herramienta como Loom o QuickTime.

| Tiempo | Qué mostrar | Qué decir |
|--------|------------|-----------|
| 0:00–0:15 | Abrí `app.epm-marketing.com/embedded-whatsapp.html` | *"This is the V4 API EPM landing page. The app requests advanced access to whatsapp_business_messaging and whatsapp_business_management with Coexistence."* |
| 0:15–0:35 | Scrolleá al Hero, que se vea el H1 | *"The hero section explains the use case: connecting WhatsApp Business App and API on the same number simultaneously using Coexistence."* |
| 0:35–1:00 | Hacé click en el botón de Embedded Signup, mostrá el popup real de Meta | *"I'll now click the Embedded Signup button. This launches the real Facebook SDK flow using FB.login with config_id for Coexistence onboarding."* |
| 1:00–1:20 | Scrolleá a la sección Caso de uso | *"The use case section explains who uses this: a small business owner replies from mobile, agents reply from the CRM — same verified number."* |
| 1:20–1:45 | Scrolleá a Limitaciones, que se vea la tabla completa | *"The Limitations section explicitly declares what does NOT work in Coexistence: broadcast lists, disappearing messages, live location, and group chats via API. The green badge deactivation and 14-day rule are also declared."* |
| 1:45–2:05 | Scrolleá a la Demo, mostrá las dos columnas | *"The demo shows both sides simultaneously: the CRM inbox on the left, the mobile WhatsApp Business view on the right — same conversation."* |
| 2:05–2:30 | Abrí `privacy-policy.html`, mostrá la sección WhatsApp Business Data | *"The Privacy Policy includes an explicit WhatsApp Business Data section covering phone number, profile name, and message metadata collection."* |
| 2:30–3:00 | Abrí `terms.html`, mostrá la sección WhatsApp Business API | *"The Terms of Service include compliance with the WhatsApp Business Messaging Policy with a direct link to whatsapp.com/legal/business-policy. Contact: soporte@v4apiepm.com. Submission ready."* |

---

## Checklist antes de enviar

- [ ] `app.epm-marketing.com` verificado en Meta Business Manager
- [ ] App ID `493451440039423` configurado en el formulario de App Review
- [ ] Config ID de Coexistence actualizado en `embedded-whatsapp.html` (línea `WA_CONFIG_ID`)
- [ ] Video grabado en inglés, duración entre 1 y 3 minutos
- [ ] Video muestra el popup real de Meta (no solo el botón)
- [ ] Privacy Policy accesible públicamente sin login
- [ ] Terms of Service accesibles públicamente sin login

---

## URLs relevantes

- Landing: https://app.epm-marketing.com/embedded-whatsapp.html
- Privacy: https://app.epm-marketing.com/privacy-policy.html
- Terms: https://app.epm-marketing.com/terms.html
- Contacto: soporte@v4apiepm.com
- Meta for Developers: https://developers.facebook.com/apps/493451440039423
