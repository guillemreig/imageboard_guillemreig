console.log("showComments.js linked!");

const showComments = {
    data() {
        return {
            comments: [],
            newComment: {
                comment: "",
            },
        };
    },
    props: ["image-id"], //"image-id" prop gets automaticaly converted to this.imageId
    template: `
    <div id="commentsDiv">
        <h4 @click="closeComments" id="xBtn">X</h4>
        <div id="commentsList">
            <div v-for="comment in comments" class="comment">
                <h4>{{ comment.username }} <span class="date"> on: {{ comment.created_at }}</span> </h4>
                <p>{{ comment.comment }}</p>
            </div>
            <form id="commentForm" action="/comment" method="post" enctype="multipart/form-data">
                <input v-model="newComment.comment" class="inputField" type="text" name="comment" placeholder="Comment" required />
                <input type="button" value="Comment" @click="addComment" />
            </form>
        </div>
    </div>
    `,
    methods: {
        closeComments() {
            console.log("closeComments()");
            this.$emit("close-comments");
        },
        addComment() {
            console.log("addComment() this.newComment.comment", this.newComment.comment);
            // prepares the FormData
            const formData = new FormData();

            formData.append("comment", this.newComment.comment);

            fetch(`/comment/${this.imageId}`, {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((commentData) => {
                    console.log("commentData :", commentData);
                    this.comments.unshift(commentData);
                })
                .catch((err) => {
                    console.log("err :", err);
                    alert("Error adding comment!");
                });
        },
    },
    mounted() {
        console.log("show-comments mounted");

        console.log("image_id", this.imageId);

        let { imageId } = this;

        let fetchPath = `/comments/${imageId}`;

        fetch(fetchPath)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("FETCH data :", data);
                this.comments = data;
            });
    },
};

export default showComments;
