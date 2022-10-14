console.log("component.js linked!");

const selectPhoto = {
    data() {
        return {
            image: {
                id: "id",
                url: "url",
                username: "username",
                title: "title",
                description: "description",
                created_at: "created_at",
            },
        };
    },
    props: ["photo"],
    template: `
        <div id="overlay">
            <div class="photo">
                <h4 @click="closePhoto">X</h4>
                <img v-bind:src="image.url" v-bind:alt="image.description"/>
                <h4>{{ image.title }}</h4>
                <p>{{ image.description }}</p>
                <p>{{ image.username }}</p>
            </div>
        </div>
    `,
    mounted() {
        console.log("mounted");

        // let id = 10;

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
    methods: {
        closePhoto() {
            this.$emit("close");
        },
    },
};

export default selectPhoto;
