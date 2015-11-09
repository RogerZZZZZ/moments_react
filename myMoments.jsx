var React = require('react/addons');

window.username = getQueryString('username');
window.ipAddress = getQueryString('ipAddress');
window.page = 1;

var ContentArea = React.createClass({
	getInitialState: function(){
		return {
			data: null
		}
	},

	componentDidMount: function(){
		var self = this;
		ajaxLoc({
			url: window.ipAddress + ':8080/moments/mymoments?username='+window.username+'&start=0&size=5',
			success:function(rst){
				console.log(rst);
				if (self.isMounted()){
					self.setState({
						data : rst
					});
				}
			}
		});
	},

	handleLoadMore: function(){
		var self = this;
		ajaxLoc({
			url: window.ipAddress + ':8080/moments/mymoments?username='+window.username+'&start='+window.page*5+'&size=5',
			success:function(rst){
				self.setState({
					moreData : rst
				});
			}
		});
	},

	render: function(){
		if(this.state.data != null){
			var twitterItem = this.state.data.map(function(twitterInfo){
				return <Twitter data={twitterInfo}></Twitter>;
			});
		}else{
			var twitterItem = null;
		}
				
		return <div>
			{twitterItem}
		</div>;
	}
});

var MoreContentArea = React.createClass({
	getInitialState: function(){
		return {
			data : this.props.data
		}
	},

	render: function(){
		if(this.state.data != null){
			var twitterItem = this.state.data.map(function(twitterInfo){
				return <Twitter data={twitterInfo}></Twitter>;
			});
		}else{
			var twitterItem = null;
		}
				
		return <div>
			{twitterItem}
		</div>;

	}
});


var Twitter = React.createClass({
	getInitialState: function(){
		return {
			data : this.props.data
		}
	},

	getTimeFun: function(){
		var timeDiff = (new Date()).getTime() - this.state.data.time;
		var timeDiff = timeDiff/1000;
		var time;
		var year = Math.floor(timeDiff/(3600*24*365));
		var month = Math.floor(timeDiff/(3600*24*30*12));
		var day = Math.floor(timeDiff/(3600*24));
		var hour = Math.floor(timeDiff/3600);
		var minute = Math.floor(timeDiff/60);
		if(year != 0){
			time = year + '年前';
		}else if(month != 0){
			time = month + '月前';
		}else if(day != 0){
			time = day + '天前';
		}else if(hour != 0){
			time = hour + '小时前';
		}else if(minute != 0){
			time = minute + '分钟前';
		}else{
			time = '刚刚';
		}
		return (<span>{time}</span>);
	},

	isLikingThisOne: function(status){
		if(status == true){
			return "favourBtn";
		}else{
			return "not-favourBtn";
		}
	},

	handleFavour: function(event){
		var tmpData = this.state.data;
		var self = this;
		var btnStatus = event.target.className;
		if(btnStatus == 'favourBtn'){
			ajaxLoc({
				url: window.ipAddress + ':8080/moments/delfavour?username='+window.username+'&mid='+ this.state.data.id,
				success:function(rst){
					self.setState({
						data: rst[0]
					});
				},
				error: function(rst){
					console.log(rst);
				}
			});
		}else if(btnStatus == 'not-favourBtn'){
			ajaxLoc({
				url: window.ipAddress + ':8080/moments/addfavour?username='+window.username+'&mid='+ this.state.data.id,
				success:function(rst){
					self.setState({
						data: rst[0]
					});
				},
				error: function(rst){
					console.log(rst);
				}
			});
		}
	},

	submitComment: function(){
		var inputVal = $(this.refs.inputVal).val();
		var self = this;
		if(inputVal == ''){
			return;
		}
		ajaxLoc({
			url: window.ipAddress + ':8080/moments/addcomment?mid='+self.state.data.id+'&from='+window.username+'&to='+$(this.refs.sendCommentBtn).attr('name')+'&content='+inputVal,
			success:function(rst){
				self.setState({
					data: rst[0]
				});
			},
			error: function(rst){
				console.log(rst);
			}
		});
		$(this.refs.inputVal).val('');
		$(this.refs.commentInputWrap).hide()	
	},

	sendComment: function(event){
		var self = this;
		$(this.refs.commentInputWrap).show();
		$(this.refs.commentSubmitBtn).unbind('click');
		$(this.refs.commentSubmitBtn).one('click', function(){
			self.submitComment();
		});
	},

	sendCommentToPerson: function(toName){
		var self = this;
		$(this.refs.commentInputWrap).show();
		$(this.refs.commentSubmitBtn).unbind('click');
		$(this.refs.commentSubmitBtn).one('click', function(){
			var inputVal = $(self.refs.inputVal).val();
			ajaxLoc({
				url: window.ipAddress + ':8080/moments/addcomment?mid='+self.state.data.id+'&from='+window.username+'&to='+toName+'&content='+inputVal,
				success:function(rst){
					self.setState({
						data: rst[0]
					});
				},
				error: function(rst){
					console.log(rst);
				}
			});
			$(self.refs.inputVal).val('');
			$(self.refs.commentInputWrap).hide()
		});

	},

	render: function(){
		var timeDiff = this.getTimeFun();
		var twitterInfo = this.state.data;
		var status = this.isLikingThisOne(twitterInfo.isfavoured);
		return (<div className="wrap">
			<div className="potrait-wrap">
				<img className="potrait-pic" src="./css/defaulthead.png" />
			</div>
			<div className="content-wrap">
				<span className="name-wrap">{twitterInfo.username}</span>
				<div className="text-wrap">
					{twitterInfo.content}
				</div>

				<ImageBox imgSrc={twitterInfo.image}></ImageBox>

				<div className="tool-wrap">
					<span className="time-wrap" name={twitterInfo.time}>
						{timeDiff}
					</span>
					<div className={status} id="favourBtn" onClick={this.handleFavour}>赞</div>
					<div className="commentBtn" ref="sendCommentBtn" onClick={this.sendComment} name={twitterInfo.username}>评论</div>
				</div>

				<FavourBox favourData={twitterInfo.favouruser}></FavourBox>

				<div className="commentInput-wrap" ref="commentInputWrap">
					<textarea className="comment-input" ref="inputVal"/>
					<div className="comment-submitBtn" ref="commentSubmitBtn">提交</div>
				</div>

				<CommentBox commentData={twitterInfo.comment} submitComment={this.sendCommentToPerson}>
				</CommentBox>		
			</div>
		</div>
		)
	}
});

var ImageBox = React.createClass({
	getInitialState: function(){
		return {
			data: this.props.imgSrc
		}
	},

	render: function(){
		if(this.state.data != ''){
			var tmpStr = this.state.data.substring(1, this.state.data.length);
			var tmpArr = tmpStr.split('@');
			var imgItem = tmpArr.map(function(imgInfo){
				return <img src={window.ipAddress + ':8080/moments/upload/' +imgInfo} className="imgItem" />;
			});
		}else{
			var imgItem = null;
		}

		return <div className="imgBox">
			{imgItem}
		</div>
	}
});


//Comment-Module
var CommentBox = React.createClass({
    // 在组件的生命周期中仅执行一次，用于设置初始状态
    getInitialState: function() {
        var comments = this.props.commentData;
        return {data: this.props.commentData};
    },
    render: function() {
        return (
            // 并非是真正的DOM元素，是React的div组件，默认具有XSS保护
            <div className="commentBox">
                <CommentList data={this.props.commentData} submitComment={this.props.submitComment}/>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
    	var submitComment = this.props.submitComment;
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment from={comment.from} to={comment.to} content={comment.content} submitComment={submitComment}>
                </Comment>
            );
        });

        return (
            <div className="commentList">
                {commentNodes}       
            </div>
        );
    }
});

var Comment = React.createClass({
	submitCommentBridge: function(event){
		var toName = $(event.currentTarget).attr('name');
		this.props.submitComment(toName);
	},

    render: function() {
        return (
            <div className="comment">
                <div className="commentAuthor" onClick={this.submitCommentBridge} to={this.props.from} name={this.props.from}>
                    {this.props.from} to {this.props.to} : {this.props.content}
                </div>
            </div>
        );
    }
});

var FavourBox = React.createClass({
	getInitialState: function(){
		if(this.props.favourData != undefined){
			var dataStr = this.props.favourData.substring(1,this.props.favourData.length);
			var dataArr = dataStr.split('@');
			return {
				data: dataArr
			}
		}else{
			return {
				data: null
			}
		}
	},

	render: function(){
		if(this.props.favourData != undefined){
			var dataStr = this.props.favourData.substring(1,this.props.favourData.length);
			var dataArr = dataStr.split('@');
			var favourItem = dataArr.map(function(favourInfo){
				return (<span className="favourItem">
					{favourInfo},
				</span>)
			})
		}else{
			var favourItem = null;
		}
		
		return (<div className="favourBox">
			{favourItem}
			</div>)
	}
});

init();

$('#backBtn').on('click', function(){
	window.location.href = 'friend-circle.html?username='+window.username+'&ipAddress='+window.ipAddress;
});


function init(){
	var randomNum = getRandomNum(5);
	$('#head-pic').attr('src', './css/top'+randomNum+'.png');
	$('#myName').text(window.username);

	$('#loadBtn').on('click', function(){
		var page = window.page;
		var moreContentWrap = document.createElement('div');
		moreContentWrap.className = 'moreContent-container';
		document.getElementById('show-container').appendChild(moreContentWrap);
		ajaxLoc({
			url: window.ipAddress + ':8080/moments/moments?username='+window.username+'&start='+window.page*5+'&size=5',
			success:function(rst){
				React.render(<MoreContentArea data={rst}/>, $('.moreContent-container')[page - 1]);
				window.page++;
			}
		});
	});
}

function getRandomNum(maxNum){
	return Math.ceil(Math.random() * maxNum);
}

function getQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

React.render(<ContentArea/>, document.getElementById('main-container'));