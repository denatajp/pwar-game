class Ground {
    constructor(image, width, height) {
        this.image = new Image()
        this.image.src = image
        this.width = width
        this.height = height
    }

    create() {
        board.drawImage(this.image, 0, 0, this.width, this.height)
        // board.fillStyle = "green"
        // board.fillRect(0, canvas.height - 50, canvas.width, 50)
    }


}