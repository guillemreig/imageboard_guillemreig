console.log("app.js linked!");

import * as Vue from "./vue.js";
import imageComponent from "./component.js";

Vue.createApp({
    data() {
        return {
            heading: "Heading app.js",
            images: [],
            newImage: {
                username: "",
                title: "",
                description: "",
                file: undefined,
            },
            component: [
                {
                    id: 1,
                    title: "Photo",
                },
            ],
            selectedPhoto: null,
        };
    },
    components: {
        "select-photo": selectPhoto,
    },
    methods: {
        upload(e) {
            console.log("uploadImage!");

            const formData = new FormData();

            console.log("this.newImage :", this.newImage);
            const { file, title, description, username } = this.newImage;

            formData.append("file", file);
            formData.append("username", username);
            formData.append("title", title);
            formData.append("description", description);
            // .append(title).append(description).append(username);

            fetch("/images", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log("Last Checkpoint. data :", data);
                    if (data.url) {
                        console.log("this.images :", this.images);
                        this.images.unshift(data);
                    }
                });
        },
        setFile(e) {
            this.newImage.file = e.target.files[0];
        },
        selectImage(id) {
            console.log("id :", id);
        },
    },
    mounted() {
        fetch("/images")
            .then((data) => {
                return data.json();
            })
            .then((images) => {
                this.images = images;
                console.log("this.images :", this.images);
                console.log("this.images[0] :", this.images[0]);
            });
    },
}).mount("main");
