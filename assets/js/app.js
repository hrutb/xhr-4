


let base_url =`https://jsonplaceholder.typicode.com` ;

let post_url = `${base_url}/posts`; 


const addPost=  document.getElementById('addPost'); 
const updatePost=  document.getElementById('updatePost'); 
const postForm=  document.getElementById('postForm'); 
const postContainer=  document.getElementById('postContainer'); 
const titleControl=  document.getElementById('title'); 
const bodyControl=  document.getElementById('body'); 
const userIdControl=  document.getElementById('userId'); 
 
const spinner= document.getElementById("spinner");



let postArr= [] ;

function snackbar(msg,icon){ 
        swal.fire({ 
               title:msg,
               timer:3000,
               icon:icon
        })
}

function createCard(arr){
        let res= "  ";
        arr.forEach(ele=>{ 
              res +=   `<div class="col-md-6 mb-4" id=${ele.id}>
                            <div class="card">
                                <div class="card-header">
                                <h3>
                                    ${ele.title}
                                  </>
                                </div>
                                
                                <div class="card-body">
                                  <p>
                                    ${ele.body}
                                  </p>

                                </div>
                                <div class="card-footer">
                                <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-warning">Edit</button>
                                <button onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger" >Delete</button>
                              </div>
                            </div>
                        </div>`
        })

        postContainer.innerHTML = res ;

}


function fetchPost(){ 
       let xhr= new XMLHttpRequest() ; //instance is created

        xhr.open('GET',post_url,true); 
        xhr.send(null)

        xhr.onload = function(){ 
           if(xhr.status>=200 && xhr.status<=299){ 
                let postArr = JSON.parse(xhr.response);
                
                  createCard(postArr);

           }  else{ 
                snackbar('API cal failed...!', 'error')     
           }   
        }

}



fetchPost();    




function onSubmit(eve){
     eve.preventDefault() ; 

    let postObj = { 
         title:titleControl.value ,
         body:bodyControl.value ,
         userId:userIdControl.value
    }  



    let xhr= new XMLHttpRequest() ;
        xhr.open("POST", post_url); 
        xhr.send(JSON.stringify(postObj)); 

        xhr.onload = function(){ 
             if(xhr.status>=200 && xhr.status<=299){ 
                 let res = JSON.parse(xhr.response);
                 let div = document.createElement('div'); 
                   div.id= res.id;
                   div.className = 'col-md-6 mb-3' ;
                   div.innerHTML =`<div class="card">
                                        <div class="card-header">
                                         <h3>
                                            ${postObj.title}
                                           </h3> 
                                        </div>
                                        
                                        <div class="card-body">
                                        <p>
                                            ${postObj.body}
                                          </p>  
                                        </div>

                                        <div class="card-footer">
                                        <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-warning">Edit</button>
                                        <button onclick="onRemove(this)"  class="btn btn-inline-block btn-outline-danger" >Delete</button>
                                    </div>
                                    </div>`

             postContainer.prepend(div);
                   
             }else{ 
                  snackbar('Submit is failed','error');
             }
        }


}

function onRemove(ele){
      let removeId= ele.closest('.col-md-6').id;
     let removeUrl = `${base_url}/posts/${removeId}`;
     

     Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed) { 
             
            let xhr= new XMLHttpRequest() ;
                xhr.open('DELETE', removeUrl);
                xhr.send(null); 
                xhr.onload=function (){ 
                if(xhr.status>=200 && xhr.status<=299){ 
                    let res =JSON.parse(xhr.response); 
                    ele.closest('.col-md-6').remove();
                           
                }else{ 
                     snackbar('Not able to delete Data', 'error')
                }
              }
        }
        });


}



function onEdit(ele){ 
      let editId= ele.closest('.col-md-6').id;
         localStorage.setItem('EditId', editId); 

       let Edit_url = `${base_url}/posts/${editId}`;
  
        let xhr = new XMLHttpRequest() ;
            xhr.open('GET', Edit_url); 
            xhr.send(JSON.stringify(Edit_url));

            xhr.onload = function (){ 
              if(xhr.status>=200 && xhr.status<=299){ 
                   let editObj = JSON.parse(xhr.response);

                   titleControl.value= editObj.title ;
                   bodyControl.value= editObj.body ;
                   userIdControl.value= editObj.userId ;
                   
                   addPost.classList.add('d-none'); 
                   updatePost.classList.remove('d-none'); 
                   
               
                }
            }
}

function onUpdate(){ 
    let updateId= localStorage.getItem('EditId');

    let updateUrl = `${base_url}/posts/${updateId}`
       let updateObj= { 
                title:titleControl.value ,
                body:bodyControl.value ,
                userId:userIdControl.value
       }
    let xhr= new XMLHttpRequest() ; 
        xhr.open('PATCH', updateUrl);
    
       xhr.send(JSON.stringify(updateObj));
       xhr.onload = function (){ 
           if(xhr.status>=200 && xhr.status<=299){ 
               let col=  document.getElementById(updateId);
                    let h3 = col.querySelector('.card-header h3');
                     h3.innerText = updateObj.title; 
                     
                    let p = col.querySelector('.card-body p');
                     p.innerText = updateObj.body  
                     
                   addPost.classList.remove('d-none'); 
                   updatePost.classList.add('d-none');

            } else{
                 snackbar('Data is not updated', 'error');
            }       
       }
    
    }







postForm.addEventListener('submit', onSubmit) ;
updatePost.addEventListener('click', onUpdate);