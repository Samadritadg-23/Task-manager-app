const button=document.querySelector('#addtask');
const popup=document.querySelector('.new-task');
const cross=document.querySelector("#cross");
const textbox=document.querySelector('.new-task-body-text');
const tickets=document.querySelector('.tickets');
const text=document.querySelector('.new-task-body-text');
const colorbtn=document.querySelectorAll('.btn');
let selectedbg=null;
const prioritybtn=document.querySelectorAll('.priorities');
const showallbtn=document.querySelector('.showall');


const clrarray=['urgent','high','medium','low'];
popup.hidden=true;
let ticketsArr=JSON.parse(localStorage.getItem("myTickets")) || [];
function loadtickets(){
    ticketsArr.forEach(function(ticket){
        createticket(ticket.tickettask,ticket.ticketid,ticket.ticketcolor);
    })
}
loadtickets();
button.addEventListener('click',function(){
    popup.hidden=false;

})
cross.addEventListener('click',function(){
    popup.hidden=true;
})
colorbtn.forEach(function(btn){
    btn.addEventListener('click',function(){

        selectedbg=btn.dataset.color;
        textbox.focus();
    })
})
textbox.addEventListener('keydown',function(e){
    if(e.key=='Enter'){
        e.preventDefault();
        const tasktext=text.value;
        const id = crypto.randomUUID().slice(0,8);
        createticket(tasktext,id,selectedbg);
        let ticketObj={
            tickettask:tasktext,
            ticketid:id,
            ticketcolor:selectedbg,
        }
        ticketsArr.push(ticketObj);
        console.log(ticketsArr);
        localStorage.setItem("myTickets",JSON.stringify(ticketsArr));
    }
    
})

function createticket(tasktext,id,selectedbg){
        let newticket=document.createElement("div");
        newticket.classList.add("demo-ticket");
        newticket.classList.add(`${selectedbg}`);
        newticket.innerHTML=`<header class="top-color" style="background-color:var(${selectedbg})"></header>
                    <div class="task-num-lock">
                        <h3 class="task id">${id}</h3>
                        <i class="fa-solid fa-lock lock"></i>
                    </div>
                    <div class="ticket-content">
                        <p class="ticket-cont" contenteditable="false">${tasktext}</p>
                    </div>
                    <footer>
                        <i class="fa-solid fa-trash dustbin" ></i>
                    </footer> `;
        tickets.appendChild(newticket);
        popup.hidden=true;
        text.value="";
        let lockbtn=newticket.querySelector(".lock");
        lockbtn.addEventListener('click',function(){
            lockbtn.classList.toggle("fa-lock");
            lockbtn.classList.toggle("fa-lock-open");
            if(lockbtn.classList.contains("fa-lock-open")){
                //make editable
                const ticketcontent=newticket.querySelector('.ticket-cont');
                ticketcontent.setAttribute('contenteditable',"true");
            }
            else if(lockbtn.classList.contains("fa-lock")){
                //not editable
                const ticketcontent=newticket.querySelector('.ticket-cont');
                ticketcontent.setAttribute('contenteditable',"false");
                let updatedtext=ticketcontent.textContent;
                const index=ticketsArr.findIndex(function(ticket){
                    return ticket.ticketid===id;
                });
                if(index!== -1){
                    ticketsArr[index].tickettask=updatedtext;
                    localStorage.setItem("myTickets",JSON.stringify(ticketsArr));
                }
            }

        }) 
        handlecolor(newticket);
        let deletebtn=newticket.querySelector('.dustbin'); 
        deletebtn.addEventListener('click',function(){
            if(lockbtn.classList.contains("fa-lock")){
                return;
            }
            else{
                const index=ticketsArr.findIndex(function(ticket){
                    return ticket.ticketid===id;
                })
                if(index!== -1){
                    ticketsArr.splice(index,1); 
                }
                localStorage.setItem("myTickets",JSON.stringify(ticketsArr));
                newticket.remove();
            }
            
        })
    }
prioritybtn.forEach(function(btn){
    btn.addEventListener('click', function(){
        const color=btn.dataset.color;
        filter(color);
    })
});
function filter(color){
    const alltickets=document.querySelectorAll('.demo-ticket');
    alltickets.forEach(function(ticket){
        if(ticket.classList.contains(color)){
            ticket.style.display="block";
        }
        else{
            ticket.style.display="none";
        }
    })
}
showallbtn.addEventListener('click', function(e){
    e.preventDefault();
    let alltickets=document.querySelectorAll('.demo-ticket');
    alltickets.forEach(function(ticket){
        ticket.style.display="block";
    })
})


//handle priority color
function handlecolor(ticket){
    const ticketcolorband=ticket.querySelector('.top-color');
    const lockbtn=ticket.querySelector('.lock');
    if(!ticketcolorband || !lockbtn){
        return;
    }
    let col=0;
    let newcol=0;
    ticketcolorband.addEventListener("click", function(){
        const cc=ticketcolorband.style.backgroundColor;
        if(lockbtn.classList.contains("fa-lock")){
            return;
        }
        for(let i=0;i<clrarray.length;i++){
            if(cc.slice(6,cc.length-1)==clrarray[i]){
                col=i;
                
            }
        }
        if(col==clrarray.length-1){
            col=-1;
        }
        ticket.classList.remove(`--${cc.slice(6,cc.length-1)}`);
        col++;
        ticket.classList.add(`--${clrarray[col]}`);
        ticketcolorband.style.backgroundColor=`var(--${clrarray[col]})`;
    })
}









