# Expense Manager

A comprehensive expense management application with SMS handling and AI-driven insights.

## Project Structure

- `public/`: Static assets and entry point.
- `auth/`: Authentication pages and logic.
- `dashboard/`: Application pages.
- `js/`: Core business logic and services.
- `css/`: Styling.

## Android notification & Play Store guidance

This project includes optional Android native code to listen for payment notifications (PhonePe / GPay) and forward them to the WebView. Important notes:

- Permission: You must declare `android.permission.BIND_NOTIFICATION_LISTENER_SERVICE` in `android/app/src/main/AndroidManifest.xml` and register a `NotificationListenerService` (the user must enable it manually in Settings).
- Manual enable: The `BIND_NOTIFICATION_LISTENER_SERVICE` permission cannot be auto-granted. Instruct users to enable Notification Access: Settings → Apps & notifications → Special app access → Notification access → Enable "Expense Manager".
- Privacy: Only payment notification text is parsed on-device; no data is sent to external servers by the native listener.

Play Store considerations

- Internal testing / personal APK: Allowed.
- Public Play Store: You may need Google approval if the permission is sensitive or the app's primary purpose is not clearly related to notifications/SMS. Provide clear disclosure, in-app explanation, and a privacy policy when submitting.

Testing steps (quick)

1. Build an internal APK and install on your test device.
2. Open Settings → Apps & notifications → Special app access → Notification access and enable access for the app.
3. Send a payment notification (or use the app's SMS/Notification simulators in `dashboard/home.html`) to verify imports.
4. Check the debug logcat for messages coming from `SmsReceiver` and `PayNotificationListener` and confirm the WebView receives `smsReceived` or `notificationReceived` events.

If you plan to publish on Play Store, include a clear privacy policy and explain why notification access is required.
