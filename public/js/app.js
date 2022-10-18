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
            this.imageMenu ? (this.imageMenu = false) : (this.imageMenu = true);
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
        upload() {
            const formData = new FormData();

            const { file, username, title, description, tags } = this.newImage;

            formData.append("file", file);
            formData.append("username", username);
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
                        // this.images.unshift(image);
                    }
                });
        },
        selectImage(id) {
            console.log("id :", id);
            this.selectedPhoto = id;
        },
        deselectImage() {
            this.selectedPhoto = false;
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
            });
    },
}).mount("main");
