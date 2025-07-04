const canvas = document.querySelector('canvas')
const board = canvas.getContext('2d')

canvas.width = DISPLAY_PIXEL.WIDTH * ASPECT_RATIO.WIDTH
canvas.height = DISPLAY_PIXEL.HEIGHT * ASPECT_RATIO.HEIGHT

const bullets = [] // Array untuk menyimpan peluru

const playerProperty = {
    width: 50,
    height: 50,
    speed: 5,
    color: "red",
    position: {
        x: 0,
        y: 0
    }
}

// Ganti inisialisasi enemy
const enemy = new Enemy({
    width: 50,
    height: 50,
    speed: 1.5,
    color: "blue",
    position: {
        x: canvas.width - 150,
        y: 100
    }
})

// Tambahkan variabel game state
let gameOver = false
let score = 0

const platforms = [
    new Platform(100, 400, 200, 20),
    new Platform(400, 300, 150, 20),
    new Platform(200, 200, 100, 20)
]

const ground = new Ground('/src/assets/bg.jpg', canvas.width, canvas.height)
const player = new Player(playerProperty);


function animate() {
    ground.create()
    for (const platform of platforms) {
        platform.create()
    }
    player.create()
    enemy.create()

    player.update()
    enemy.update(player, platforms)

    // Cek serangan enemy
    if (enemy.attack(player)) {
        console.log(`Player health: ${player.health}`)
    }

    // Cek kematian player
    if (player.health <= 0 && !gameOver) {
        gameOver = true
        alert("Game Over! Player defeated.")
    }

    // Cek kematian enemy
    if (enemy.health <= 0) {
        // Reset enemy atau spawn baru
        enemy.health = 100
        enemy.position.x = Math.random() * (canvas.width - 100)
        enemy.position.y = 100
        score += 100
    }

    // Gambar skor
    board.fillStyle = "white"
    board.font = "24px Arial"
    board.fillText(`Score: ${score}`, 20, 30)
    board.fillText(`Health: ${player.health}`, 20, 60)

    // Update dan gambar semua peluru
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update()
        bullets[i].create()

        // Hapus peluru jika keluar layar
        if (bullets[i].isOffScreen()) {
            bullets.splice(i, 1)
            continue
        }

        // Cek tabrakan peluru dengan enemy
        if (bullets[i].isCollidingWith(enemy)) {
            enemy.takeDamage(bullets[i].damage)
            bullets.splice(i, 1)
        }
    }

    window.requestAnimationFrame(animate)
}

window.addEventListener('keydown', function (callback) {
    switch (callback.key) {
        case 'ArrowUp':
            player.jump()
            break
        case 'ArrowLeft':
            player.moveLeft()
            break
        case 'ArrowRight':
            player.moveRight()
            break
        case ' ':
        case 'Spacebar': // Untuk browser lama
            player.shoot()
            break
        default:
            break
    }
})

window.addEventListener('keydown', (e) => {
    if (e.key === ' ') player.shoot() //
})

animate()