const components = {}

components.welcomeScreen = `
    <div> Welcome to chat app </div>
`
components.registerScreen = `
<div class="register-container">
            <div class="register-form">
                <div class="title">TindX</div>
                <form id="form-register">
                    <div class="name-wrapper">
                        <div class="input-wrapper">
                            <input type="text" name="firstName" placeholder="First Name...">
                            <div class="error" id="error-first-name"></div>
                        </div>
                        <div class="input-wrapper">
                            <input type="text" name="lastName" placeholder="Last Name...">
                            <div class="error" id="error-last-name"></div>
                        </div>
                    </div>
                    <div class="input-wrapper">
                        <input type="email" name="email" placeholder="Email...">
                        <div class="error" id="error-email"></div>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" name="password" placeholder="Password...">
                        <div class="error" id="error-password"></div>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" name="confirmPassword" placeholder="Confirm Password...">
                        <div class="error" id="error-confirm-password"></div>
                    </div>
                    <div class="submit-wrapper">
                        <div>Already have an account? <span class="cursor-pointer" id="redirect-to-login">Login</span></div>
                        <button class="btn" type="submit">Register</button>
                    </div>
                </form>
            </div>
        </div>
`
components.loginScreen = `
<div class="login-container">
            <div class="login-form">
                <div class="title">TindX</div>
                <form id="form-login">
                    
                    <div class="input-wrapper">
                        <input type="email" name="email" placeholder="Email...">
                        <div class="error" id="error-email"></div>
                    </div>
                    <div class="input-wrapper">
                        <input type="password" name="password" placeholder="Password...">
                        <div class="error" id="error-password"></div>
                    </div>
                    
                    <div class="submit-wrapper">
                        <div>Don't have an account? <span class="cursor-pointer" id="redirect-to-register">Register</span></div>
                        <button class="btn" type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
`

components.chatScreen = `
        <div class="header">
        TindX - Say NO to fwb and ons!
        </div>    
        <div class="chat-container">
            <div class="aside-left">
                <div class = "my-profile">
                  <button class="btn" id = "my-profile">My Profile</button>
                </div>

                <nav class="p-2">
                    <div class="nav nav-pills d-flex justify-content-center border-0" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active " id="nav-matches-tab" data-toggle="tab" href="#nav-matches" role="tab" aria-controls="nav-matches" aria-selected="true">Matches</a>
                        <a class="nav-item nav-link" id="nav-chats-tab" data-toggle="tab" href="#nav-chats" role="tab" aria-controls="nav-chats" aria-selected="false">Chats</a>
                    
                    </div>
                </nav>
              <div class="tab-content" id="nav-tabContent">
                <div class="tab-pane fade show active" id="nav-matches" role="tabpanel" aria-labelledby="nav-matches-tab">
                <div class="list-matches d-flex flex-wrap justify-content-even">
                
                 
                    <div class="matches p-2">
                        <div class="card bg-dark text-white ">
                          <img src="../images/320x400_pic1.jpg" class="card-img" alt="...">
                          <div class="card-img-overlay">
                            <div class="card-title position-absolute bottom-0">Giang</div>
                          </div>
                        </div>
                    </div>
                    <div class="matches p-2">
                        <div class="card bg-dark text-white ">
                          <img src="../images/320x400_pic2.jpg" class="card-img" alt="...">
                          <div class="card-img-overlay">
                            <div class="card-title position-absolute bottom-0 ">Huong</div>
                            
                          </div>
                        </div>
                    </div>
                    <div class="matches p-2">
                        <div class="card bg-dark text-white ">
                          <img src="../images/320x400_pic3.jpg" class="card-img" alt="...">
                          <div class="card-img-overlay">
                            <div class="card-title position-absolute bottom-0 ">Thao</div>
                            
                          </div>
                        </div>
                    </div>
                    <div class="matches w-33 p-2">
                        <div class="card bg-dark text-white ">
                          <img src="../images/320x400_pic4.jpg" class="card-img" alt="...">
                          <div class="card-img-overlay">
                            <div class="card-title position-absolute bottom-0 ">Anh</div>
                            
                          </div>
                        </div>
                    </div>
                    <div class="matches w-33 p-2">
                        <div class="card bg-dark text-white ">
                          <img src="../images/320x400_pic5.jpg" class="card-img" alt="...">
                          <div class="card-img-overlay">
                            <div class="card-title position-absolute bottom-0 ">Linh</div>
                            
                          </div>
                        </div>
                    </div>
                 
                    

                </div>
                </div>
                <div class="tab-pane fade" id="nav-chats" role="tabpanel" aria-labelledby="nav-chats-tab">
                
                <div class="list-conversations">
                

                </div>
                
                
                
                </div>
              
              </div>

            </div>
            <div class="main">
                <div class="conversation-detail">
                
                    <div class="conversation-title"></div>
                    <div class="list-message">

                    </div>
                    <form id="sendMessageForm">
                        <input type="text" class="input" name="message" placeholder="Type a message">
                        <button class="btn"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                    </form>
                </div>
            </div>
           
                
            </div>
        </div>
`


components.changeProfileSettingScreen = `
<div class = "my-profile-setting-wrapper">
    <div class="header">
    TindX - Say NO to fwb and ons!
    </div>    
    <div class="profile-container d-flex p-5 justify-content-around">
        <div class="main">
            <h3 class="mb-1rem">My profile setting</h3>
            <form id="change-profile-setting-form">
                
                <div class="input-wrapper mb-1rem">
                    <input type="text" name="displayName" placeholder="Display Name">
                    <div class="error" id="display-name-error"></div>
                </div>

                <div class="input-wrapper mb-1rem">
                    <textarea  type="text" maxlength="500" name="bio" placeholder="Bio"></textarea>
                    <div class="error" id="bio-error"></div>
                </div>

                <div class="input-wrapper mb-1rem">
                    <input type="number" min="1900" name="birthYear" placeholder="Birth Year">
                    <div class="error" id="birth-year-error"></div>
                </div>


                <div class="input-wrapper mb-1rem">
                    <input type="file" name="picture1" accept="image/*" placeholder="Picture 1">
                    <div class="error" id="picture1-error"></div>
                </div>

                <div class="input-wrapper mb-1rem">
                    <input type="file" name="picture2" accept="image/*" placeholder="Picture 2">
                    <div class="error" id="picture2-error"></div>
                </div>

                <div class="input-wrapper mb-1rem">
                    <input type="file" name="picture3" accept="image/*" placeholder="Picture 3">
                    <div class="error" id="picture3-error"></div>
                </div>
            
                
                <div class="button-wrapper">
                    <button class = "btn" type="submit">Save</button>
                    <button type="button" id='back-to-chat'>Cancel</button>
                </div>
            </form>
        </div>

        <div class="right">
            <div id="carouselExampleIndicators" class="carousel" data-interval="false">
                <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img class="d-block " src="../images/320x400_pic1.jpg" alt="First slide">
                    <div class="carousel-caption d-none d-md-block">
                        <h5>Thanh</h5>
                        <p>Hello test bio 1</p>
                    </div>
                    </div>
                    <div class="carousel-item">
                    <img class="d-block " src="../images/320x400_pic2.jpg" alt="Second slide">
                    
                    </div>
                    <div class="carousel-item">
                    <img class="d-block " src="../images/320x400_pic3.jpg" alt="Third slide">
                    </div>
                </div>
                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>


        </div>
    </div>
</div>
`