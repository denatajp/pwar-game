class Player {
    constructor(props) {
        this.width = props.width
        this.height = props.height
        this.speed = props.speed
        this.color = props.color
        this.position = {
            x: props.position.x,
            y: props.position.y
        }

        // laju player, akan berubah saat bergerak
        this.velocity = {
            x: 0,
            y: 0
        }
        this.heightJump = 100,
        this.onGround = false
        this.gravity = 0.5 // gravity constant
        this.health = 100
        this.maxHealth = 100
        this.damageEffect = 0
    }

    jump() {
        this.velocity.y = -Math.sqrt(2 * this.gravity * this.heightJump)
    }

    moveRight() {
        this.velocity.x = 1 * this.speed
    }

    moveLeft() {
        this.velocity.x = -1 * this.speed
    }

    takeDamage(amount) {
        this.health -= amount
        if (this.health < 0) this.health = 0

        // Efek visual
        this.damageEffect = 10
    }


    update() {
        const ground = canvas.height - this.height
        const rightWall = canvas.width - this.width

        // Reset status onGround
        this.onGround = false

        // Apply gravity
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // Cek collision dengan setiap platform
        for (const platform of platforms) {
            if (this.isCollidingWith(platform)) {
                // Hitung overlap
                const bottomOverlap = this.position.y + this.height - platform.position.y
                const topOverlap = platform.position.y + platform.height - this.position.y
                const leftOverlap = this.position.x + this.width - platform.position.x
                const rightOverlap = platform.position.x + platform.width - this.position.x

                // Cari overlap terkecil untuk menentukan sisi collision
                const minOverlap = Math.min(bottomOverlap, topOverlap, leftOverlap, rightOverlap)

                if (minOverlap === bottomOverlap) {
                    // Collision dari atas (berdiri di platform)
                    this.position.y = platform.position.y - this.height
                    this.velocity.y = 0
                    this.jump()
                    this.onGround = true
                } else if (minOverlap === topOverlap) {
                    // Collision dari bawah (membentur bagian bawah platform)
                    this.position.y = platform.position.y + platform.height
                    this.velocity.y = 0
                } else if (minOverlap === leftOverlap) {
                    // Collision dari kanan
                    this.position.x = platform.position.x - this.width
                    this.velocity.x = 0
                } else if (minOverlap === rightOverlap) {
                    // Collision dari kiri
                    this.position.x = platform.position.x + platform.width
                    this.velocity.x = 0
                }
            }
        }

        if (this.position.y > ground) {
            this.position.y = ground
            this.velocity.y = 0
            this.onGround = true
            this.jump()
        }

        if (this.position.x < 0) {
            this.velocity.x *= -1
        }

        if (this.position.x > rightWall) {
            this.velocity.x *= -1
        }

        // Cek batas samping
        if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x *= -0.5 // Redam tumbukan
        }

        if (this.position.x > rightWall) {
            this.position.x = rightWall
            this.velocity.x *= -0.5 // Redam tumbukan
        }
    }

    // Cek collision dengan objek lain
    isCollidingWith(object) {
        return (
            this.position.x < object.position.x + object.width &&
            this.position.x + this.width > object.position.x &&
            this.position.y < object.position.y + object.height &&
            this.position.y + this.height > object.position.y
        )
    }

    shoot() {
        // Tentukan arah tembakan berdasarkan arah player
        const direction = this.velocity.x >= 0 ? 1 : -1;

        bullets.push(new Bullet(
            this.position.x + (direction === 1 ? this.width : 0),
            this.position.y + this.height / 2,
            10,
            "yellow",
            direction
        ))
    }

    create() {
        // Efek damage
        if (this.damageEffect && this.damageEffect > 0) {
            board.fillStyle = "red"
            this.damageEffect--
        } else {
            board.fillStyle = this.color
        }
        board.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Gambar health bar
        // Health bar
        const healthBarWidth = 50
        const healthRatio = this.health / this.maxHealth
        board.fillStyle = "red"
        board.fillRect(this.position.x, this.position.y - 15, healthBarWidth, 5)
        board.fillStyle = "green"
        board.fillRect(this.position.x, this.position.y - 15, healthBarWidth * healthRatio, 5)
    }
}