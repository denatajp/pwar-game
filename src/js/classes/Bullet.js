// src/js/classes/Bullet.js
class Bullet {
    constructor(x, y, speed, color, direction = 1) {
        this.position = { x, y }
        this.speed = speed
        this.color = color
        this.width = 8
        this.height = 8
        this.direction = direction // 1 untuk kanan, -1 untuk kiri
        this.damage = 25
    }

    update() {
        this.position.x += this.speed * this.direction
    }

    isOffScreen() {
        return this.position.x < 0 || 
               this.position.x > canvas.width ||
               this.position.y < 0 ||
               this.position.y > canvas.height
    }

    create() {
        board.fillStyle = this.color
        board.beginPath()
        board.arc(this.position.x, this.position.y, this.width/2, 0, Math.PI * 2)
        board.fill()
    }

    isCollidingWith(object) {
        return (
            this.position.x < object.position.x + object.width &&
            this.position.x + this.width > object.position.x &&
            this.position.y < object.position.y + object.height &&
            this.position.y + this.height > object.position.y
        )
    }
}