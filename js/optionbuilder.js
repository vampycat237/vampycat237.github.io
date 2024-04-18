const ob = {
    e: document.getElementById("option-builder"),

    layer: {
        lineart: document.getElementById("ob-lineart"),
        shading: document.getElementById("ob-shading")
    }
}

//builds a path to an image based on the ID
function getImg(id) {
    //TODO: check if shading, add "cel" or "soft"?
    return "../assets/_testing/ob_" + id;
}

function updateOptionBuilder() {
    console.log(moneymachine.cart.filter(item => item.includes("shading")));
    //TODO
}