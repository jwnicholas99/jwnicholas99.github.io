// Filter for the projects section

const filterBtns = document.querySelector("#filter-btns").children;
const projects = document.querySelector(".project-cards").children;

for (let i=0; i < filterBtns.length; i++){
    filterBtns[i].addEventListener("click", function(){
        for (let j=0; j < filterBtns.length; j++){
            filterBtns[j].classList.remove("active")
        }
        this.classList.add("active")
        const category= this.getAttribute("project-category")

        for (let k=0; k < projects.length; k++){
            projects[k].style.display = "none";

            if (category == "all" || projects[k].getAttribute("category-id").split(" ").includes(category)) {
                projects[k].style.display = "block";
            }
        }
    })
}