// ページが表示された時Chatリストを表示する
$(function() {
  getList();
});

// フォームを送信ボタンを押すと、Chatを追加して再表示する
$('#fm').submit(function() {
  postList();
  return false;
});

// Chat一覧を取得して表示する
function getList() {
  // 既に表示されている一覧を非表示にして削除する
  var $list = $('.list');
  $list.fadeOut(function() {
    $list.children().remove();
    // /chatにGETアクセスする
    $.get('chat', function(chats) {
      // 取得したChatを追加していく
      $.each(chats, function(index, chat) {
        $list.append('<p>名前：' + chat.name + '<br>内容：' + chat.text + '</p>');
      });
      // 一覧を表示する
      $list.fadeIn();
    });
  });
}


// フォーム入力されたChatを追加する
function postList() {
  // フォームに入力された値を取得
  var name = $('#name').val();
  var text = $('#text').val();

  // テキストの入力項目を空にする
  $('#text').val('');

  // /chatにPOSTアクセスする
  $.post('chat', {name: name, text: text}, function(res) {
    console.log(res);
    // 再度表示する
    getList();
  });
}