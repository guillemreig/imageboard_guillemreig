console.log("app.js linked!");

import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            heading: "Heading app.js",
            images: [],
        };
    },
    methods: {
        // upload(e) {
        //     // e.preventDefault(); // replaced by .prevent in html
        //     console.log("upload(e)!");

        //     const form = e.currentTarget;
        //     console.log("form :", form);

        //     const fileInput = form.querySelector("input[type=file]");
        //     console.log("fileInput.files :", fileInput.files);

        //     if (fileInput.files.length < 1) {
        //         this.message = "You must first select a file!";
        //         return;
        //     }

        //     const myFormData = new FormData(form);

        //     fetch(form.action, {
        //         method: form.method,
        //         body: myFormData,
        //     })
        //         .then((res) => {
        //             res.json();
        //         })
        //         .then((data) => {
        //             if (data.message) {
        //                 this.message = data.message;
        //             }
        //             if (data.path) {
        //                 this.images.push(data.path);
        //             }
        //         });
        // },
        uploadImage() {
            console.log("uploadImage!");

            const file = document.querySelector("input[type=file]").files[0];
            console.log("file :", file);

            const formData = new FormData();
            console.log("formData (before):", formData);

            formData.append("file", file);
            console.log("formData (after):", formData);

            fetch("/images", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    if (data.path) {
                        this.images.unshift({ url: data.path });
                    }
                });
        },
    },
    mounted() {
        fetch("/images")
            .then((data) => {
                console.log("data :", data);
                return data.json();
            })
            .then((images) => {
                console.log("images :", images);
                this.images = images;
            });
    },
}).mount("main");
