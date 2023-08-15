




export function ajoutListenersAvis() {
    const piecesElements = document.querySelectorAll(".lesAvis")
    console.log("Call of ajoutListenersAvis() the external function")
    console.log(piecesElements.length)
    for (let i = 0; i < piecesElements.length; i++) {
      piecesElements[i].addEventListener("click", async function (event) {
        const id = event.target.dataset.id;
        if(document.getElementById(`div:${id}`).contains(document.getElementById(`${id}`))){
          console.log("Already comment is displayed ...")    
        } else {
          console.log("ID called is " + id)
          let commentsJsonResponse = window.localStorage.getItem("comments"+id)
          console.log("comments"+id)
          if(commentsJsonResponse !== null){
            console.log("localStorage is acting here for COMMENTS")  
            commentsJsonResponse = JSON.parse(commentsJsonResponse)
          } else {
            const response = await fetch("http://localhost:8081/pieces/"+id+"/avis")
            commentsJsonResponse = await response.json()
            console.log(commentsJsonResponse.length)
            console.log('VIA CONNECTION RETRIEVING DATA here for COMMENTS ...')
            window.localStorage.setItem("comments"+id, JSON.stringify(commentsJsonResponse))
          }
          commentsJsonResponse.forEach(element => {
          const pComment = document.createElement("p")
          pComment.setAttribute('id', `${id}`)
          pComment.innerHTML += `${element.utilisateur} : ${element.commentaire}<br>`  
          document.getElementById(`div:${id}`).appendChild(pComment)
          console.log(element)
          });
        }
      });
    }
}

export function ajoutListenerEnvoyerAvis(){

  const sendComment = document.querySelector(".formulaire-avis")
  sendComment.addEventListener("submit", (event) => {
      event.preventDefault()
      const comment = {
        pieceId : parseInt(event.target.querySelector("[name=piece-id]").value), 
        utilisateur : event.target.querySelector("[name=username]").value, 
        commentaire : event.target.querySelector("[name=comment]").value, 
        nbEtoiles : parseInt(event.target.querySelector("[name=rating]").value)
      }
      const payload = JSON.stringify(comment)
  console.log(payload)    
  fetch("http://localhost:8081/avis", {
        method : "POST", 
        headers : { "Content-type" : "application/json" }, 
        body : payload
    })

  })
}





