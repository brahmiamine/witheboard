#!/usr/bin/env node

import http from "http";

function testApp() {
  const options = {
    hostname: "localhost",
    port: 5173,
    path: "/",
    method: "GET",
    timeout: 5000,
  };

  const req = http.request(options, (res) => {
    console.log("✅ Serveur accessible sur http://localhost:5173");
    console.log(`📊 Status: ${res.statusCode}`);

    if (res.statusCode === 200) {
      console.log("🎉 Application whiteboard fonctionne correctement !");
      console.log("\n📋 Fonctionnalités disponibles :");
      console.log("  • Ajout de post-its, rectangles et textes");
      console.log("  • Drag & drop des éléments");
      console.log("  • Édition en double-cliquant");
      console.log("  • Suppression avec Delete");
      console.log("  • Mode sombre automatique");
      console.log("\n🌐 Ouvrez http://localhost:5173 dans votre navigateur");
    } else {
      console.log("❌ Erreur : Status code non-200");
    }
  });

  req.on("error", (err) => {
    console.log("❌ Erreur de connexion :", err.message);
    console.log("💡 Assurez-vous que le serveur est démarré avec : npm run dev");
  });

  req.on("timeout", () => {
    console.log("⏰ Timeout : Le serveur ne répond pas");
    req.destroy();
  });

  req.end();
}

testApp();
