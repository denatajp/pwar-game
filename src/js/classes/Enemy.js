// src/js/classes/Enemy.js
class Enemy {
    constructor(props) {
        this.width = props.width
        this.height = props.height
        this.speed = props.speed
        this.color = props.color
        this.position = {
            x: props.position.x,
            y: props.position.y
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.gravity = 0.5
        this.health = 100
        this.damage = 10
        this.attackCooldown = 0
    }

    update(player, platforms) {
        const groundLevel = canvas.height - this.height

        // AI: Bergerak menuju player
        const dx = player.position.x - this.position.x
        const dy = player.position.y - this.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 0) {
            this.velocity.x = (dx / distance) * this.speed
            this.velocity.y = (dy / distance) * this.speed
        }

        // Terapkan gravitasi
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // Reset status onGround
        this.onGround = false

        // Cek collision dengan platform
        for (const platform of platforms) {
            if (this.isCollidingWith(platform)) {
                // Hitung overlap
                const bottomOverlap = this.position.y + this.height - platform.position.y
                const topOverlap = platform.position.y + platform.height - this.position.y
                const leftOverlap = this.position.x + this.width - platform.position.x
                const rightOverlap = platform.position.x + platform.width - this.position.x

                // Cari overlap terkecil
                const minOverlap = Math.min(bottomOverlap, topOverlap, leftOverlap, rightOverlap)

                if (minOverlap === bottomOverlap) {
                    // Berdiri di platform
                    this.position.y = platform.position.y - this.height
                    this.velocity.y = 0
                    this.onGround = true
                } else if (minOverlap === topOverlap) {
                    // Membentur bagian bawah platform
                    this.position.y = platform.position.y + platform.height
                    this.velocity.y = 0
                } else if (minOverlap === leftOverlap) {
                    // Membentur dari kanan
                    this.position.x = platform.position.x - this.width
                    this.velocity.x = 0
                } else if (minOverlap === rightOverlap) {
                    // Membentur dari kiri
                    this.position.x = platform.position.x + platform.width
                    this.velocity.x = 0
                }
            }
        }

        // Cek batas bawah canvas
        if (this.position.y > groundLevel) {
            this.position.y = groundLevel
            this.velocity.y = 0
            this.onGround = true
        }

        // Cooldown serangan
        if (this.attackCooldown > 0) this.attackCooldown--
    }

    isCollidingWith(object) {
        return (
            this.position.x < object.position.x + object.width &&
            this.position.x + this.width > object.position.x &&
            this.position.y < object.position.y + object.height &&
            this.position.y + this.height > object.position.y
        )
    }

    attack(player) {
        if (this.attackCooldown === 0 && this.isCollidingWith(player)) {
            player.takeDamage(this.damage)
            this.attackCooldown = 60 // 1 detik (60fps)
            return true
        }
        return false
    }

    takeDamage(amount) {
        this.health -= amount
        if (this.health < 0) this.health = 0
        
        // Efek visual: berubah warna saat terkena damage
        this.damageEffect = 10
    }

    create() {
        // Efek damage (berkedip merah)
        if (this.damageEffect && this.damageEffect > 0) {
            board.fillStyle = "red"
            this.damageEffect--
        } else {
            board.fillStyle = this.color
        }
        
        board.fillRect(this.position.x, this.position.y, this.width, this.height)
        
        // Gambar health bar
        const healthBarWidth = 50
        const healthRatio = this.health / 100
        board.fillStyle = "red"
        board.fillRect(this.position.x, this.position.y - 15, healthBarWidth, 5)
        board.fillStyle = "green"
        board.fillRect(this.position.x, this.position.y - 15, healthBarWidth * healthRatio, 5)
    }
}