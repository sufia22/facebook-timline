// get elements
const post_form = document.getElementById('post_add_form');
const post_edit_form = document.getElementById('post_edit_form');
const msg = document.querySelector('.msg');
const all_posts = document.querySelector('.all-posts');




// get all posts
const getAllPosts = () =>{

    let posts = readLSData('fb_post');
    let list = '';

    if( !posts ){
        all_posts.innerHTML = ` 
            <div class="card shadow-sm text-center" style='border-radius:10px'>
                <div class="card-body">
                    No post found
                </div>
            </div>
        `;
        return false;
    }

    posts.reverse().map( data => {

    list += `
    <div class="post-timeline-area my-3">
        <div class="card">
            <div class="card-body">

                <!-- Post Auth Area  -->
                <div class="post-auth-area">
                    <div class="user-info">
                        <img src="${ data.aphoto }" alt="">
                        <div class="details">
                            <span>${ data.aname }</span>
                            <span>2h . <i class="fas fa-globe-asia"></i> </span>
                        </div>
                    </div>
                    <div class="dropdown">
                        <button class=" dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                          <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                          <li><a class="dropdown-item edit-post" post_id=${ data.id } data-bs-toggle="modal" href="#post-edit-modal">Edit</a></li>
                          <li><a class="dropdown-item delete-post" post_id=${ data.id } href="#">Delete</a></li>
                        </ul>
                      </div>
            
                </div>

                <!-- Post Content Area  -->
                <div class="post-content-area my-3">
                    <p>${ data.pcontent }</p>
                    
                </div>
            </div>
            
            ${ data.pphoto ? '<img class="w-100 post-photo" style="height:400px; object-fit: cover;" src="'+ data.pphoto +'" alt="">' : '' }
        </div>
        
    </div>
        
        `;

    } );

    all_posts.innerHTML = list;



}

getAllPosts();




// post form submit
post_form.onsubmit = (e) => {

    e.preventDefault();

    // get form data
    const form_data = new FormData(e.target);
    const data = Object.fromEntries(form_data.entries());
    const { aname, aphoto, pcontent, pphoto } = Object.fromEntries(form_data.entries());

    // create a random ID
    const randId = Math.floor(Math.random() * 1000000) + '_' + Date.now();

    // validation
    if( !aname || !aphoto || !pcontent ){
        msg.innerHTML = setAlert('All fields are required');
    } else {
        createLSData('fb_post', { ...data, id : randId });
        e.target.reset();
        getAllPosts();
    }


}


// data delete
all_posts.onclick = (e) => {

    e.preventDefault();

    // delete post
    if( e.target.classList.contains('delete-post') ){
        
        // get post ID
        const postId = e.target.getAttribute('post_id');

        // get all posts
        const posts = readLSData('fb_post');

        // delete data array
        const deleted_data = posts.filter( data => data.id !== postId );

        // now update new data
        updateLSData('fb_post', deleted_data );
        getAllPosts();

    }


    // edit post
    if( e.target.classList.contains('edit-post') ){

        // get post Id
        const postId = e.target.getAttribute('post_id');

        // get all posts
        const posts = readLSData('fb_post');
   
        // data array
        // let { aname, aphoto, pcontent, pphoto, id } = posts.find( data => data.id == postId );
        const edit_data = posts.findIndex(data => data.id == postId );
        const { aname, aphoto, pcontent, pphoto, id } = posts[edit_data];

    

        // set value
        post_edit_form.innerHTML = `
        <div class="my-3">
            <label for="">Auth Name</label>
            <input name="aname" type="text" value="${ aname }" class="form-control">
            <input name="id" type="hidden" value="${ id }" class="form-control">
        </div>
        <div class="my-3">
            <img class="post-photo" style="width:100px; height:100px;" src="${ aphoto }" alt="">
        </div>
        <div class="my-3">
            <label for="">Auth Photo</label>
            <input name="aphoto" type="text" value="${ aphoto }" class="form-control">
        </div>
        <div class="my-3">
            <label for="">Post Content</label>
            <textarea name="pcontent" class="form-control">${ pcontent }</textarea>
        </div>
        <div class="my-3">
            <img class="w-100 post-photo" style="height:300px;" src="${ pphoto }" alt="">
        </div>
        <div class="my-3">
            <label for="">Post Photo</label>
            <input name="pphoto" type="text" value="${ pphoto }" class="form-control">
        </div>
        <div class="my-3">
            <input type="submit" class="btn btn-primary w-100" value="Update">
        </div>
        `;

     

    }


}


// edit post submit
post_edit_form.onsubmit = (e) => {
    e.preventDefault();

    // get form data
    const form_data = new FormData(e.target);
    const { aname, aphoto, pcontent, pphoto, id } = Object.fromEntries(form_data.entries());

    // get all data
    let all_data = readLSData('fb_post');
    let index = all_data.findIndex( data => data.id == id );
    all_data[index] = { aname, aphoto, pcontent, pphoto, id };


    // update post
    updateLSData('fb_post', all_data );
    getAllPosts();
    
    console.log(all_data);

}
