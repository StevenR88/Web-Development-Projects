function getStats() {
    document.getElementById("API").innerHTML = "USER API: " + localStorage.getItem("apiKey");
    document.getElementById("color").innerHTML = "COLOR: " + localStorage.getItem("color");
    document.getElementById("num_moves").innerHTML = "# OF MOVES: " + localStorage.getItem("num_moves_made");

}