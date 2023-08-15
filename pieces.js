
import { ajoutListenersAvis, ajoutListenerEnvoyerAvis } from "./avis.js"

let pieces = window.localStorage.getItem("pieces") 
if(pieces !== null){
    console.log("LENGTH in STORAGE : "+pieces.length)
    pieces = JSON.parse(pieces)
    console.log('localStorage is acting here ...')
} else {
    const answer = await fetch("http://localhost:8081/pieces")
    pieces = await answer.json()
    window.localStorage.setItem("pieces", JSON.stringify(pieces))
    console.log('VIA CONNECTION RETRIEVING DATA here ...')
          }


ajoutListenerEnvoyerAvis()

const btnUpdate = document.querySelector(".btn-update")
btnUpdate.addEventListener("click", () => {
    console.log("click UPDATE")
    window.localStorage.removeItem("pieces")
    pieces.forEach(element => {
        window.localStorage.removeItem("comments"+element.id)
    });
})

const piecesDescAffordable = pieces.filter((p)=>{
    return p.prix<=35
}).map(piece => piece.nom)
console.log(piecesDescAffordable)
console.log("LENGTH : " + piecesDescAffordable.length)
const affordableElements = document.createElement("ul") 
piecesDescAffordable.forEach(element => {
    const affordableElement = document.createElement("li")
    affordableElement.innerHTML = element
    affordableElements.appendChild(affordableElement)
});
document.querySelector(".affordable").appendChild(affordableElements)

const cursorMaxPrice = document.querySelector("#prixMax")
cursorMaxPrice.addEventListener("input", ()=>{
    console.log(cursorMaxPrice.value)
    const piecesCursorMaxPrice = pieces.filter((piece)=>{
        return piece.prix <= cursorMaxPrice.value
    })
    document.querySelector(".fiches").innerHTML = ""
    decorate(piecesCursorMaxPrice)
})

const namePiecesAvailable = pieces.map(piece => piece.nom)
const prixPiecesAvailable = pieces.map(piece => piece.prix)
for(let i=pieces.length-1; i>=0;i--){
    if(pieces[i].disponibilite == false){
        namePiecesAvailable.splice(i, 1)
        prixPiecesAvailable.splice(i, 1)
    }
}
const availableElements = document.createElement("ul") 
for(let i=0; i<namePiecesAvailable.length; i++){
    const availableElement = document.createElement("li")
    availableElement.innerText = namePiecesAvailable[i] +" - "+prixPiecesAvailable[i]
    availableElements.appendChild(availableElement)
}
document.querySelector(".available").appendChild(availableElements)

function decorate(elements){
    for(let i=0; i<elements.length; i++){

        const item = elements[i]
        const img = document.createElement("img")
        img.src = elements[i].image
        const name = document.createElement("h2")
        name.innerText = elements[i].nom
        const price = document.createElement("p")
        const preis = elements[i].prix ?? 0
        const str = preis < 35.0 ? "(€)" : "(€€€)"
        console.log(preis)
        price.innerText = "Price : " + preis + " € " + str
        // price.innerText = `Price : ${item.prix} € (${item.prix < 35 ? "€" : "€€€"})`
        const category = document.createElement("p")
        category.innerText = elements[i].categorie ?? "(No category)"
        const desc = document.createElement("p")
        desc.innerText = elements[i].description ?? "No description is available right now"
        const isAvailable = document.createElement("p")
        isAvailable.innerText = elements[i].disponibilite ? "En stock" : "Rupture de stock"
        const commentPiece = document.createElement("button")
        commentPiece.textContent = 'Display comments'
        commentPiece.setAttribute('class', 'lesAvis')
        commentPiece.setAttribute('data-id', `${elements[i].id}`)
    //TABLE STATIQUE GARDANT LES IDS 1ERE FOIS
        const articles = document.querySelector(".fiches")
        const divs = document.createElement("div")
        divs.setAttribute('id', `div:${elements[i].id}`)
        divs.appendChild(img)
        divs.appendChild(name)
        divs.appendChild(price)
        divs.appendChild(category)
        divs.appendChild(desc)
        divs.appendChild(isAvailable)
        divs.appendChild(commentPiece)

        articles.appendChild(divs)
    }
    ajoutListenersAvis()
}

decorate(pieces)

const btnHavingDesc = document.querySelector(".btn-havingDesc")
btnHavingDesc.addEventListener("click", () => {
    const articles = document.querySelector(".fiches")
    articles.innerHTML = ""
    const havingDesc = pieces.filter(function(piece){
        return piece.description
    })
    console.log("LENGTH : " + havingDesc.length)
    console.log("LENGTH ORIGINAL: " + pieces.length)
    console.log(havingDesc)
    decorate(havingDesc)
})

const btnSort = document.querySelector(".btn-trierCr");
btnSort.addEventListener("click", function(){
    const articles = document.querySelector(".fiches")
    articles.innerHTML = ""
    const copySorted = Array.from(pieces)
    copySorted.sort(function(a, b){
        const aPreis = a.prix ?? 0
        const bPreis = b.prix ?? 0
        return aPreis - bPreis
    });
    console.log(copySorted)
    decorate(copySorted)
});

const btnSortDecr = document.querySelector(".btn-trierDecr");
btnSortDecr.addEventListener("click", function(){
    const articles = document.querySelector(".fiches")
    articles.innerHTML = ""
    const copySortedInv = Array.from(pieces)
    copySortedInv.sort(function(a, b){
        const aPreis = a.prix ?? 0
        const bPreis = b.prix ?? 0
        return bPreis - aPreis
    });
    console.log(copySortedInv)
    decorate(copySortedInv)
});

const bntFilter  = document.querySelector(".btn-filtrer")
bntFilter.addEventListener("click",() => {
    const articles = document.querySelector(".fiches")
    articles.innerHTML = ""
    const copyFiltered = pieces.filter(function(piece){
        const preis  = piece.prix ?? 0
        return preis <= 35
    })
    console.log("LENGTH : " + copyFiltered.length)
    console.log("LENGTH ORIGINAL: " + pieces.length)
    console.log(copyFiltered)
    decorate(copyFiltered)
})
