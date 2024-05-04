document.getElementById("btn-login").addEventListener("click", (event) => {
     event.preventDefault(); // Ngăn chặn hành động mặc định của form
 
     let username = document.getElementById("username").value.trim();
     let password = document.getElementById("password").value.trim();
 
     if (username === "admin" && password === "admin") {
         // Lưu trạng thái đăng nhập vào Local Storage
         localStorage.setItem("isLoggedIn", true);
         // Thực hiện chuyển hướng
         document.body.classList.add('fade-out');
         setTimeout(function(){
             window.location = "../assets/manage.html"; // Chuyển hướng sau khi hoàn thành animation
         }, 500);
     } else {
         // Hiển thị thông báo lỗi
         Swal.fire({
             title: "Thất bại!",
             text: "Username hoặc Mật khẩu không chính xác",
             icon: "error"
         });
     }
 });
 