var KekkoApp = {
    var _rootUrl = "/";
    var initChainOrder = function () {
        $("#addChaninOrder").on("click", function () {
            $.ajax({
                type:'post',
                url: _rootUrl + "chain/add",
                data:"",
                dataType: 'json',
                cache: false,
                success: function (data) {
                    this.setState({ data: data }); // Notice this
                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        });
    };

}


$(document).ready(function () {

});