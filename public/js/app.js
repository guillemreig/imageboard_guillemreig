console.log("app.js linked!");

import * as Vue from "./vue.js";
import selectPhoto from "./selectPhoto.js"; // Components

// BODY
Vue.createApp({
    data() {
        return {
            images: [[], [], []],
            imageIndex: 3,
            lastId: 0,
            user: {
                id: "",
                username: "",
                email: "",
                password: "",
                picture: "",
                created_at: "",
                file: undefined,
            },
            newImage: {
                title: "",
                description: "",
                tags: "",
                path: "",
                file: undefined,
            },
            selectedPhoto: false,
            moreButton: true,
            registrationMenu: false,
            loginMenu: false,
            imageMenu: false,
        };
    },
    components: {
        "select-photo": selectPhoto,
    },
    methods: {
        toggleRegistrationMenu() {
            this.registrationMenu ? (this.registrationMenu = false) : (this.registrationMenu = true);
        },
        toggleLoginMenu() {
            this.loginMenu ? (this.loginMenu = false) : (this.loginMenu = true);
        },
        toggleImageMenu() {
            if (this.user.id) {
                this.imageMenu ? (this.imageMenu = false) : (this.imageMenu = true);
            } else {
                this.toggleLoginMenu();
            }
        },
        signIn() {
            console.log("signin() this.user :", this.user);
            const formData = new FormData();

            const { file, username, email, password } = this.user;

            formData.append("file", file);
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);

            fetch("/registration", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((userData) => {
                    console.log("userData :", userData);
                    if (userData) {
                        this.user = userData;
                    }
                    this.toggleRegistrationMenu();
                })
                .catch((err) => {
                    console.log("err :", err);
                });
        },
        logIn() {
            console.log("logIn() this.user :", this.user);
            const formData = new FormData();

            const { email, password } = this.user;

            formData.append("email", email);
            formData.append("password", password);

            fetch("/login", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((userData) => {
                    console.log("userData :", userData);
                    if (userData) {
                        this.user = userData;
                    }
                    this.toggleLoginMenu();
                })
                .catch((err) => {
                    console.log("err :", err);
                    alert("Wrong email!");
                });
        },
        logOut() {
            fetch("/logout").then((res) => {
                this.user = {
                    id: "",
                    username: "",
                    email: "",
                    password: "",
                    picture: "",
                    created_at: "",
                    file: undefined,
                };
            });
        },
        moreImages() {
            console.log("moreImages()");

            const lastId = this.lastId; // We get the last id from somewhere
            console.log("lastId :", lastId);

            const route = `/more/${lastId}`; // we prepare the fetch route

            fetch(route)
                .then((res) => {
                    return res.json();
                })
                .then((images) => {
                    for (let image of images) {
                        this.images[this.imageIndex % 3].push(image);
                        this.imageIndex++;
                    }
                    this.lastId = images[images.length - 1].id;
                    console.log("this.lastId :", this.lastId);
                    if (this.lastId == images[0].lowestId) {
                        this.moreButton = false;
                    }
                });
        },
        setPicture(e) {
            if (e.target.files && e.target.files[0]) {
                // Update 'user.file' value
                this.user.file = e.target.files[0];

                // Image preview
                var reader = new FileReader();

                reader.onload = function (e) {
                    $("#picture").attr("src", e.target.result);
                };

                reader.readAsDataURL(e.target.files[0]);
            }
        },
        setFile(e) {
            if (e.target.files && e.target.files[0]) {
                // Update 'newImage.file' value
                this.newImage.file = e.target.files[0];

                // Image preview
                var reader = new FileReader();

                reader.onload = function (e) {
                    $("#preview").attr("src", e.target.result);
                };

                reader.readAsDataURL(e.target.files[0]);
            }
        },
        uploadImage() {
            const formData = new FormData();

            const { file, title, description, tags } = this.newImage;

            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("tags", tags);

            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((image) => {
                    if (image.url) {
                        this.images[this.imageIndex % 3].unshift(image);
                        this.imageIndex++;
                        this.toggleImageMenu();
                        // this.images.unshift(image);
                    }
                });
        },
        selectImage(id) {
            console.log("id :", id);
            this.selectedPhoto = id;

            history.pushState({}, "", `/imageId/${id}`);
        },
        deselectImage() {
            this.selectedPhoto = false;

            history.pushState({}, "", `/`);
        },
        checkPath() {
            console.log("location.pathname :", location.pathname);
            let pathUrl = location.pathname;

            // check URL and grab image ID
            if (pathUrl.includes("imageId")) {
                const pathArr = location.pathname.split("/");
                console.log("pathArr :", pathArr);

                const id = pathArr[pathArr.length - 1];

                console.log("path id :", id);
                this.selectedPhoto = id;
            } else {
                this.selectedPhoto = null;
            }
        },
    },
    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((images) => {
                console.log("images :", images);
                for (let image of images) {
                    this.images[this.imageIndex % 3].push(image);
                    this.imageIndex++;
                }
                this.lastId = images[images.length - 1].id;
                console.log("this.lastId :", this.lastId);
            })
            .then(() => {
                this.checkPath();
            });

        addEventListener("popstate", (e) => {
            console.log("location.pathname :", location.pathname);
            this.checkPath();
        });
    },
}).mount("main");
