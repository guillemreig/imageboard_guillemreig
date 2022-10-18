console.log("selectPhoto.js linked!");

// import * as Vue from "./vue.js";
import showComments from "./showComments.js"; // Components

const selectPhoto = {
    data() {
        return {
            image: {
                id: "id",
                url: "url",
                username: "username",
                title: "title",
                description: "description",
                tags: "tags",
                created_at: "created_at",
                likes: "0",
                comments: "0",
            },
            commentsShown: false,
        };
    },
    props: ["photo"],
    template: `
    <div id="overlay">
        <div id="photoNcomments">
            <div id="photo">
                <h4 @click="closePhoto" id="xBtn">X</h4>
                <img id="image" v-bind:src="image.url" v-bind:alt="image.description"/>
                <div id="info">
                    <div id="stats">
                        <p><span>{{ image.title }} By: {{ image.username }}</span></p>
                        <p><span>{{ image.likes }} 🤍</span><span @click="toggleComments"> {{ image.comments }} 💬</span></p>
                    </div>
                    <p>{{ image.description }}</p>
                    <p>Tags: {{ image.tags }}</p>
                    <p>{{ image.created_at }}</p>
                </div>
            </div>
            <show-comments v-if="commentsShown" @close-comments="toggleComments" v-bind:image-id="image.id"> </show-comments>
        </div>

    </div>
    `,
    components: {
        "show-comments": showComments,
    },
    methods: {
        closePhoto() {
            this.$emit("close-photo");
        },
        toggleComments() {
            console.log("toggleComments");
            this.commentsShown ? (this.commentsShown = false) : (this.commentsShown = true);
        },
    },
    mounted() {
        console.log("select-photo mounted");

        let id = this.photo;

        let fetchPath = `/image/${id}`;

        fetch(fetchPath)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("FETCH data :", data);
                this.image = data;
            });
    },
};

export default selectPhoto;
