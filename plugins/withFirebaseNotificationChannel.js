const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withFirebaseNotificationChannel(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application[0];
    const metaData = application['meta-data'] || [];

    const entry = metaData.find(
      (m) => m.$['android:name'] === 'com.google.firebase.messaging.default_notification_channel_id'
    );

    if (entry) {
      entry.$['tools:replace'] = 'android:value';
    }

    // Ensure xmlns:tools is declared on the manifest root
    mod.modResults.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';

    return mod;
  });
};
