
const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("CondoHub API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CondoHub API online"
  });
});

app.get("/api/avatar/:username", async (req, res) => {
  try {
    const username = req.params.username;

    const response = await fetch(
      "https://users.roblox.com/v1/usernames/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: true
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        success: false,
        message: "Roblox sedang tidak bisa diakses"
      });
    }

    const data = await response.json();
    const user = data.data?.[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username Roblox tidak ditemukan"
      });
    }

    const avatarResponse = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`
    );

    const avatarData = await avatarResponse.json();

    res.json({
      success: true,
      username: user.name,
      displayName: user.displayName,
      userId: user.id,
      avatar: avatarData.data?.[0]?.imageUrl || null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada API"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CondoHub API running on port ${PORT}`);
});
      
