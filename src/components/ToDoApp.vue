<template>
<div id='container'>
 <input type="text" placeholder="Create A New Task..."  id="main-box" v-model='taskname'/>
<div style="padding:2em;"><button v-on:click="newTask()">Add Task</button></div>
</div>
<div id="todo-holder">
<ul v-for="(task,index) in tasks" :key="task.id">
  <li v-bind:id="index"><span v-bind:title="task.text">{{ task.text }}</span> <input type="text" v-bind:value="task.text" hidden /> <div class="btns"><button style="background:dodgerblue;" v-on:click="updateTask(task.id,index)" class="edit-btn">Edit</button> &nbsp;&nbsp;<button v-on:click="DelTask(task.id,index)">Delete</button></div></li><br>
</ul>
</div>
</template>

<script>
import fetchData from "node-fetch";
export default {
  name: 'ToDoApp',
  data(){ 
      return {
       tasks: [
          
        ],
        taskname:""
      }
       },
  methods:{
     newTask(){
         const { taskname }=this;
          if (taskname){
       let id;
       if (this.tasks.length>0){
        id=this.tasks[this.tasks.length-1].id+1;
}
         else {
           id=1;
           }
        this.tasks.push({text:taskname,id});
        this.taskname='';
         fetchData("http://localhost:5000/add-todo",{method:"POST",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify({text:taskname})}).then(res=>{
     console.log(res.status);
                   res.json();
                 }).then(data=>console.log(data));
         }
      },
      DelTask(id,index){
          document.querySelectorAll("li")[index].remove();
        fetchData("http://localhost:5000/del-todo",{method:"POST",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify({ id })}).then(({status})=>console.log(status));
       },
      updateTask(id,index){
              let listItem=document.querySelectorAll("li")[index];
              let spanElement=listItem.querySelector("span");
              let inputElement=listItem.querySelector("input");
              let btnElement=listItem.querySelector(".edit-btn");
              spanElement.hidden=true;
              inputElement.hidden=false;
              btnElement.innerText='save';
              btnElement.addEventListener("click",()=>{
               let text=inputElement.value;
              console.log(text); 
              spanElement.hidden=false;
              inputElement.hidden=true;
              spanElement.title=text;
              spanElement.innerText=text;
               fetchData("http://localhost:5000/update-todo",{method:"POST",headers:{"Content-Type":"application/json;charset=utf-               8"},body:JSON.stringify({ id,text })}).then(({status})=>{
                    console.log(`update request status code - ${status}`);
                    location.reload();
                    });
             });
         }
       
 },
 async created(){
   const {data}= await (await fetchData("http://localhost:5000")).json();
   this.tasks=data;
 }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
*{font-family: 'Noto Sans JP', sans-serif;}
#main-box{
width:25em;
font-size:1.3em;
outline:none;
border:none;
border-bottom-style:solid;
border-bottom-color:#ff3c38;
}
#container{
display:flex;
justify-content:center;
align-items:center;
flex-wrap:wrap;
}
#container button{
background:#ff3c38;
border:none;
color:white;
padding:1em;
border-radius:4px;
cursor:pointer;
}
#todo-holder{
padding-left:15em;
}
#todo-holder > ul{
text-align: left;
 list-style-position: inside;
}
#todo-holder > ul > li{
font-size:1.3em;
padding:1em;
width:80%;
cursor:pointer;
}
#todo-holder > ul > li button{
background:#ff3c38;
border:none;
color:white;
padding:0.8em;
border-radius:4px;
cursor:pointer;
}
#todo-holder > ul > li input{
width:25em;
font-size:1em;
outline:none;
border:none;
border-bottom-style:solid;
border-bottom-color:#ff3c38;
}
.btns{float:right;}
@media all and (max-width:950px){
#todo-holder{
padding-left:0em;
}
.btns{float:none;padding-top:1em;text-align:center;}
#todo-holder > ul > li{
width:100%;
padding:0em;
}
}
#todo-holder > ul > li input{
width:12em;
font-size:1em;
outline:none;
border:none;
border-bottom-style:solid;
border-bottom-color:#ff3c38;
}
</style>
