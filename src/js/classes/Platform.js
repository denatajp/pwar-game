// Platform.js
class Platform {
    constructor(x, y, width, height, color = "brown") {
        this.position = { x, y }
        this.width = width
        this.height = height
        this.color = color
    }
    
    create() {
        board.fillStyle = this.color
        board.fillRect(this.position.x, this.position.y, this.width, this.height)

        // Tambahkan efek visual
        board.strokeStyle = "#000"
        board.lineWidth = 2
        board.strokeRect(this.position.x, this.position.y, this.width, this.height)
    }
}