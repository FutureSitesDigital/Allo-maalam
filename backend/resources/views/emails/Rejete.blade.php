<!DOCTYPE html>
<html>
<head>
    <title>Inscription Refusée</title>
</head>
<body>
    <h1>❌ Votre inscription a été refusée</h1>
    <p>Bonjour {{ $name }},</p>
    <p>Nous regrettons de vous informer que votre demande d'inscription a été refusée pour la raison suivante :</p>
    <div style="background: #f8f8f8; padding: 15px; border-radius: 5px; margin: 15px 0;">
        {{ $raison }}
    </div>
    <p>Pour toute question, vous pouvez contacter notre service client.</p>
    <p>Cordialement,<br>L'équipe Allo-Maalam</p>
</body>
</html>
