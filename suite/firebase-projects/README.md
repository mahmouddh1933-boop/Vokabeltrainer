# Public Firebase WEB configurations

These are public client SDK settings supplied for the independent Start and A1/A2 projects. They contain no service-account credentials. The existing shared project configuration remains unchanged.

Build only the configured deployment packages:

```sh
python3 tools/build-suite.py --directory firebase-public --hosting
python3 tools/build-independent-firebase.py --directory /tmp/huroof-firebase-ready --editions start a1-a2 --project-config-directory suite/firebase-projects --archives
python3 tests/configured-firebase-packages.py
```

Each Ready ZIP includes its matching public configuration, `.firebaserc`, `firebase.json`, rules, deploy helper and app files. Enable Email/Password and create the project's default Standard Firestore database in Console before deployment. No cloud project is created or deployed by the build.
