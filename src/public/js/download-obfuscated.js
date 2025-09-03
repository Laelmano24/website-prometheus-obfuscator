const obfuscatedLabel = document.querySelector(".obfuscated-content")
const downloadbutton = document.getElementById("download-button")

const obfuscatedFile = new Blob([obfuscatedLabel.innerHTML], { type: "text/plain" })
const url = URL.createObjectURL(obfuscatedFile)

downloadbutton.href = url