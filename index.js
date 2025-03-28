document.addEventListener("DOMContentLoaded", () => {
    const toyCollection = document.getElementById("toy-collection");
    const toyForm = document.querySelector(".add-toy-form");
    const toyFormContainer = document.querySelector(".container");
    const newToyBtn = document.getElementById("new-toy-btn");
    let addToy = false;
  
    // Toggle toy form visibility
    newToyBtn.addEventListener("click", () => {
      addToy = !addToy;
      toyFormContainer.style.display = addToy ? "block" : "none";
    });
  
    // Fetch and display toys
    function fetchToys() {
      fetch("http://localhost:3000/toys")
        .then((res) => res.json())
        .then((toys) => {
          toyCollection.innerHTML = "";
          toys.forEach(renderToy);
        })
        .catch((error) => console.error("Error fetching toys:", error));
    }
  
    // Render a single toy card
    function renderToy(toy) {
      const toyCard = document.createElement("div");
      toyCard.classList.add("card");
  
      toyCard.innerHTML = `
        <h2>${toy.name}</h2>
        <img src="${toy.image}" class="toy-avatar" />
        <p>${toy.likes} Likes</p>
        <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
  
      // Add event listener to like button
      toyCard.querySelector(".like-btn").addEventListener("click", () => updateLikes(toy, toyCard));
  
      toyCollection.appendChild(toyCard);
    }
  
    // Add a new toy
    toyForm.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const toyName = e.target.name.value;
      const toyImage = e.target.image.value;
  
      if (!toyName || !toyImage) {
        alert("Please enter both name and image URL.");
        return;
      }
  
      const newToy = { name: toyName, image: toyImage, likes: 0 };
  
      fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newToy),
      })
        .then((res) => res.json())
        .then((toy) => {
          renderToy(toy);
          toyForm.reset();
        })
        .catch((error) => console.error("Error adding toy:", error));
    });
  
    // Update likes
    function updateLikes(toy, toyCard) {
      const newLikes = toy.likes + 1;
  
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ likes: newLikes }),
      })
        .then((res) => res.json())
        .then((updatedToy) => {
          toy.likes = updatedToy.likes;
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
        })
        .catch((error) => console.error("Error updating likes:", error));
    }
  
    // Load all toys on page load
    fetchToys();
  });
  