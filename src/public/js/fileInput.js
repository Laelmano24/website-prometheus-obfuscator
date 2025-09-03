const labelFile = document.getElementById("id-file-label")
const inputFile = document.getElementById("id-file-input")

inputFile.addEventListener("change", () => {
    const file = inputFile.files[0]
    
    if (file) {
        labelFile.innerHTML = "Name: " + file.name
        console.log(file)
    } else {
        labelFile.innerHTML = "Choose a file to obfuscate"
    }
})
