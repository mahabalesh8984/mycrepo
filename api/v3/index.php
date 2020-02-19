<?php
 use Monolog\Logger;
 use Monolog\Handler\RotatingFileHandler;
 use \Firebase\JWT\JWT;
 use  Tuupola\Base62;
require 'vendor/autoload.php';
$app = new \Slim\App(array( 'debug' => true ));
require_once 'db.php';
$app->add(function ($req, $res, $next) {
    $response = $next($req, $res);
    return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
});
$logger = new Logger("slim");
$rotating = new RotatingFileHandler(__DIR__ . "/logs/slim.log", 0, Logger::DEBUG);
$logger->pushHandler($rotating);
$container = $app->getContainer();
$container['logger'] = function($c) {
    $logger = new \Monolog\Logger('my_logger');
    $file_handler = new \Monolog\Handler\StreamHandler('../logs/app.log');
    $logger->pushHandler($file_handler);
    return $logger;
};
 
$app->add(new \Slim\Middleware\JwtAuthentication([
    "path" => ["/books"],
    "passthrough" => ["/login"],
    "secret" => "supersecretkeyyoushouldnotcommittogithub",
    "algorithm" => ["HS256", "HS384"],
    "callback" => function ($request, $response, $arguments) use ($container) {
        $container["jwt"] = $arguments["decoded"];
    },
    "error" => function ($request, $response, $arguments) {
        $data["status"] = "error";
        $data["message"] = $arguments["message"];
        return $response
            ->withHeader("Content-Type", "application/json")
            ->write(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
    }
]));

$app->get('/hello/{name}', function ($request, $response, $args) {
    $name = $args['name'];
    $response->getBody()->write("Hello, $name");
    return $response;
});

function token($emid,$name,$dbnm){
    $now = new DateTime();
    $future = new DateTime("now +2 hours");
     $future1 = new DateTime("now +3 hours");
    $jti = new Base62(["characters" => Base62::GMP]);
    $secret = "supersecretkeyyoushouldnotcommittogithub";
    $payload = [
        "emid" =>$emid,
        "ename"=>$name,
        "dbname"=>$dbnm,
        "jti" => $jti,
        "nbf"=>$future1->getTimeStamp(),
        "iat" => $now->getTimeStamp(),
        "exp" => $future->getTimeStamp()
    ];
    JWT::$leeway = 60;
    $token = JWT::encode($payload, $secret, "HS256");
    return $token;
}

$app->post('/login', function ($request, $response, $args) use ($app) {
    //$token  = token();
    $response=array();
    $data = $request->getParsedBody();
    $username = $data['username'];
    $password = $data['password'];
    $scode= $data['scode'];
    $fyear = $data['fyear'];
    $con = adminDb();
    //$qry = "select cldb,clid,clnm from clients where clcode='$scode' AND fyear='$fyear'";




    $qry = "select cd.cldbstr as cldb, cm.clid as clid,cm.clcd as clnm from clientmaster cm inner join clientdetail cd on cd.clid=cm.clid where cm.clcd='$scode' AND cd.ayid=$fyear";
    $sql = mysqli_query($con,$qry) or die(mysqli_error($con));
    $count = mysqli_num_rows($sql);
    if($count==1){
        $adm = mysqli_fetch_assoc($sql);
        $dbnm = $adm['cldb'];

        if (!isset($_SESSION)) {
            session_start();
        }
        $_SESSION['dbname'] =  $dbnm;
        mysqli_next_result($con);
        $conn  = getConnection($dbnm);
        $user = "select * from employee where uname='$username' AND password='$password'";
        $exec=mysqli_query($conn , $user) or die(mysqli_error($conn));
        $ucount = mysqli_num_rows($exec);
        if($ucount==1){
            $udata = mysqli_fetch_assoc($exec);
            $emid       =     $udata['emid'];
            $fname      =     $udata['fname'];
            $lname      =     $udata['lname'];
            $photo      =     $udata['photo'];
            $education  =     $udata['education'];
            $name = $fname. " ". $lname;
             $email = "sandeep@gmail.com";
             $token  = token($emid,$name,$dbnm);
             $response["token"] = $token;
              $response['username']=$name;
             $response['photo']= $photo;
             $response['education']= $education;
        }else{
            $response['status']='error';
            $response['message']='Wrong login credentails';
            $response['user']="No user found";
        }
    }else{
        $response['status']='error';
        $response['message']='School code wrong';
        $response['user']="No user found";
    }
    echo json_encode($response); 
//echoResponse(200,$response);
});
 
// $app->get('/modules',function($request, $response, $args){
//     $db = $this->jwt->dbname;
//     $conn = getConnection($db);
//     $refs = array();
//     $list = array();
//     $sql ="select * from menus where active='Yes'";
//     $result = mysqli_query($conn,$sql) or die(mysqli_error($conn));
//     while($data = mysqli_fetch_assoc($result)) {
//         $thisref = &$refs[ $data['mid'] ];
//         $thisref['mnm'] = $data['mnm'];
//         $thisref['url'] = $data['url'];
//         $thisref['icon'] = $data['icon'];
//          $thisref['parent_id'] = $data['pid'];
//         if ($data['pid'] == 0) {
//             $list[  ] = &$thisref;
//         } else {
//             $refs[ $data['pid'] ]['children'][] = &$thisref;
//         }
//     }
//     $mylist["data"] = $list;
// echo json_encode($mylist);
// });


$app->get('/modules',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycplvdev");
    $list=array();
    $mylist=array();
    $sql ="select * from menus where active='Yes' order by sortid1";
    $result = mysqli_query($conn,$sql) ;
    while($data = mysqli_fetch_assoc($result)) {
        $thisref = &$refs[ $data['mid'] ];
        $thisref['mnm'] = $data['mnm'];
        $thisref['url'] = $data['url'];
        $thisref['icon'] = $data['icon'];
        $thisref['mlabel'] = $data['mlabel'];
         $thisref['parent_id'] = $data['pid'];
        if ($data['pid'] == 0) {
            $list[  ] = &$thisref;
        } else {
            $refs[ $data['pid'] ]['children'][] = &$thisref;
        }
    }
    $mylist["data"] = $list;
echo json_encode($mylist);
});

$app->get('/db1',function($request, $response, $args){
    $db = $this->jwt->dbname;
    $conn = getConnection($db);
   
    $list = array();
    $mylist=array();
    $sql ="select * from menus";
    $result = mysqli_query($conn,$sql) or die(mysqli_error($conn));
    while($data = mysqli_fetch_assoc($result)) {
       // $thisref = &$refs[ $data['mid'] ];
        $thisref['mnm'] = $data['mnm'];
        $list[] = $thisref;
    }
    $mylist["data"] = $list;
echo json_encode($mylist);
});

$app->get('/classlist',function($request, $response, $args){
    //$db = $this->jwt->dbname;
    $db="mycplvdev";
    $conn = getConnection("mycplvdev");
    $list=array();
   // $conn = mysqli_connect($host,$user,$pass,$db);
    // if($conn){
    //     echo "success";
    // }
    $sql ="select clid,clname,clcode from masclass";
    $result = mysqli_query($conn,$sql) ;
    while($data = mysqli_fetch_assoc($result))
     {
        $list['classdata'][] =  $data;
        
    }
    echo json_encode($list);
});

// sp_masclass list
$app->get('/sel_sp_masclass',function($request, $response, $args){

    if (!isset($_SESSION)) {
    session_start();
}
$db=$_SESSION['dbname'];
  //  
 // $db="mycplvdev";
   
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_class(0,0,0,0,'$db','selall')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masclass'][] = $data;
     }
    echo json_encode($patdt);
});


$app->get('/sel_sp_classection',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_classection(0,0,0,'seltop10','$db','0')";
    // $result= mysqli_query($conn,$sql) ;
    //  while($data = mysqli_fetch_assoc($result)) {
    //      $patdt['sp_classection'][] = $data;
    //  }
    echo json_encode($sql);
});

$app->get('/sel_sp_classectionlike/{strlike}',function($request, $response, $args){
    $db="mycplvdev";
    $lkdata=$args['strlike'];
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_classection(0,0,0,'selike','$db','$lkdata')";
    $result= mysqli_query($conn,$sql);
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_classection'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_masclass', function ($request, $response, $args) use ($app) {
    $dbnm="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data = $request->getParsedBody();
    $clcode = $data['clcode'];
    $clname = $data['clname'];
    $clid= $data['clid'];
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
             $sql="CALL sp_class(0,'$clcode',' $clname',0,'$dbnm','insert')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_class($clid,'$clcode',' $clname',0,'$dbnm','update')";
        }
    else{
             $sql="CALL sp_class($clid,'$clcode',' $clname',0,'$dbnm','delete')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="class added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="class updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="class deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add class";
        }
     echo json_encode($response); 
});

// sp_massection list
$app->get('/sel_sp_massection',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_massection(0,0,0,'$db','selall',0)";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_massection'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_massection', function ($request, $response, $args) use ($app){
    $dbnm="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data = $request->getParsedBody();
    $secid= $data['secid'];
    $seccode = $data['seccode'];
    $secname = $data['secname'];
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
             $sql="CALL sp_massection(0,'$seccode','$secname','$dbnm','insert',0)";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_massection($secid,'$seccode','$secname','$dbnm','update',0)";
        }
    else{
            $sql="CALL sp_massection($secid,'$seccode','$secname','$dbnm','delete',0)";
        }
    
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="class added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="class updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="class deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add class";
        }
     echo json_encode($response); 
});

// sel_sp_massubcat list
$app->get('/sel_sp_massubcat',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_massubcat(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_massubcat'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_massubcat', function ($request, $response, $args) use ($app) {
    $dbnm="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data = $request->getParsedBody();
    $subcaid= $data['subcaid'];
    $subcacd = $data['subcacd'];
    $subcanm = $data['subcanm'];
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
            $sql="CALL sp_massubcat(0,'$subcacd','$subcanm','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_massubcat($subcaid,'$subcacd','$subcanm','update','$dbnm')";
        }
    else{
            $sql="CALL sp_massubcat($subcaid,'$subcacd','$subcanm','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="massubcat added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="massubcat updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="massubcat deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add massection";
        }
     echo json_encode($response); 
});

// sel_sp_massubgp list
$app->get('/sel_sp_massubgp',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_massubgp(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_massubgp'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_massubgp', function ($request, $response, $args) use ($app) {
    $dbnm     = "mycplvdev";
    $conn     = adminDb();
    $response = array();
    $data     = $request->getParsedBody();
    $subgpid  = $data['subgpid'];
    $subgpcd  = $data['subgpcd'];
    $subgpnm  = $data['subgpnm'];
    $oprtag   = $data['oprtag'];

    if($oprtag=='insert'){
            $sql="CALL sp_massubgp(0,'$subgpcd','$subgpnm','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_massubgp($subgpid,'$subgpcd','$subgpnm','update','$dbnm')";
        }
    else{
            $sql="CALL sp_massubgp($subgpid,'$subgpcd','$subgpnm','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="massubgp added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="massubgp updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="massubgp deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add massubgp";
        }
     echo json_encode($response); 
});

// sp_massubject list
$app->get('/sel_sp_massubjects',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_massubjects(0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_massubjects'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_massubjects', function ($request, $response, $args) use ($app) {
    //$db="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data = $request->getParsedBody();
    $subid = $data['subid'];
    $sortid = '0';
    $subcode = $data['subcode'];
    $subname = $data['subname'];
    $subgpId = $data['subgpId'];
    $subcaId = $data['subcaId'];
    $oprtag = $data['oprtag'];
    $dbnm=$data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_massubjects(0,$sortid,'$subcode','$subname','$subgpId','$subcaId','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_massubjects($subid,'$sortid','$subcode','$subname','$subgpId','$subcaId','update','$dbnm')";
        }
    else{
            $sql="CALL sp_massubjects($subid,'$sortid','$subcode','$subname','$subgpId','$subcaId','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="massubjects added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="massubjects updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="massubjects deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add massubjects";
        }
     echo json_encode($response); 
});

// sel_sp_masasshead list
$app->get('/sel_sp_masasshead',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_masasshead(0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masasshead'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_masasshead', function ($request, $response, $args) use ($app) {
    //
    $conn=adminDb();
    
    $response=array();
    $data = $request->getParsedBody();
    $assid= $data['assid'];
    $asscode = $data['asscode'];
    $assname = $data['assname'];
    $display = 'Yes';
    $oprtag = $data['oprtag'];
    $dbnm=$data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_masasshead(0,'$asscode','$assname','$display','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_masasshead($assid,'$asscode','$assname','$display','update','$dbnm')";
        }
    else{
            $sql="CALL sp_masasshead($assid,'$asscode','$assname','$display','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masasshead added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="masasshead updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="masasshead deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masasshead";
        }
     echo json_encode($response); 
});


// sel_sp_masasstype list
$app->get('/sel_sp_masasstype',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_masasstype(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masasstype'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_masasstype', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $asstypeid   = $data['asstypeId'];
    $asstypecode = $data['asstypecode'];
    $asstypename = $data['asstypename'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_masasstype(0,'$asstypecode','$asstypename','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_masasstype($asstypeid,'$asstypecode','$asstypename','update','$dbnm')";
        }
    else{
            $sql="CALL sp_masasstype($asstypeid,'$asstypecode','$asstypename','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masasstype added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="masasstype updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="masasstype deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masasstype";
        }
     echo json_encode($response); 
});

// sel_sp_masoccation list
$app->get('/sel_sp_masoccation',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_masoccation(0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masoccation'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_masoccation', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $occid       = $data['occid'];
    $occcode     = $data['occcode'];
    $occname     = $data['occname'];
    $occtag      = $data['occtag'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_masoccation(0,'$occcode','$occname','$occtag','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_masoccation($occid,'$occcode','$occname','$occtag','update','$dbnm')";
        }
    else{
            $sql="CALL sp_masoccation($occid,'$occcode','$occname','$occtag','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masoccation added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="masoccation updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="masoccation deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masoccation";
        }
     echo json_encode($response); 
});

// sel_sp_exmsubcomb list
$app->get('/sel_sp_exmsubcomb',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_exmsubcomb(0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_exmsubcomb'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_exmsubcomb', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $sucbid      = $data['sucbid'];
    $sucbnm      = $data['sucbnm'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_exmsubcomb(0,'$sucbnm','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_exmsubcomb($sucbid,'$sucbnm','update','$dbnm')";
        }
    else{
            $sql="CALL sp_exmsubcomb($sucbid,'$sucbnm','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="exmsubcomb added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="exmsubcomb updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="exmsubcomb deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add exmsubcomb";
        }
     echo json_encode($response); 
});


// sp_accaccounthead list
$app->get('/sel_sp_accaccounthead',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_accaccounthead(0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_accaccounthead'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_accaccounthead', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $accid       = $data['accid'];
    $acccode     = $data['acccode'];
    $accname     = $data['accname'];
    $ag01        = $data['ag01'];
    $ag02        = "";
    $ag03        = "";
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_accaccounthead(0,'$acccode','$accname','$ag01','$ag02','$ag03','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_accaccounthead($accid,'$acccode','$accname','$ag01','$ag02','$ag03','update','$dbnm')";
        }
    else{
            $sql="CALL sp_accaccounthead($accid,'$acccode','$accname','$ag01','$ag02','$ag03','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="accaccounthead added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="accaccounthead updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="accaccounthead deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add accaccounthead";
        }
     echo json_encode($response); 
});

// accdept list
$app->get('/sel_sp_accdept',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_accdept(0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_accdept'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_accdept', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $deptid      = $data['deptid'];
    $deptcd      = $data['deptcd'];
    $deptnm      = $data['deptnm'];
    $deptaccnm   = $data['deptaccnm'];
    $deptacccat  = $data['deptacccat'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_accdept(0,'$deptcd','$deptnm','$deptaccnm','$deptacccat','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_accdept($deptid,'$deptcd','$deptnm','$deptaccnm','$deptacccat','update','$dbnm')";
        }
    else{
            $sql="CALL sp_accdept($deptid,'$deptcd','$deptnm','$deptaccnm','$deptacccat','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="accdept added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="accdept updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="accdept deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add accdept";
        }
     echo json_encode($response); 
});

// sel_sp_accinstallment list
$app->get('/sel_sp_accinstallment',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_accinstallment(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_accinstallments'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_accinstallment', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $insid       = $data['insid'];
    $inscode     = $data['inscode'];
    $insname      = $data['insname'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_accinstallment(0,'$inscode','$insname','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_accinstallment($insid,'$inscode','$insname','update','$dbnm')";
        }
    else{
            $sql="CALL sp_accinstallment($insid,'$inscode','$insname','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="accinstallment added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="accinstallment updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="accinstallment deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add accinstallment";
        }
     echo json_encode($response); 
});

// sel_sp_accpayoptions list
$app->get('/sel_sp_accpayoptions',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_accpayoptions(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_accpayoptions'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_accpayoptions', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $payoptid    = $data['payoptid'];
    $payoptcode  = $data['payoptcode'];
    $payoptname  = $data['payoptname'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_accpayoptions(0,'$payoptcode','$payoptname','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_accpayoptions($payoptid,'$payoptcode','$payoptname','update','$dbnm')";
        }
    else{
            $sql="CALL sp_accpayoptions($payoptid,'$payoptcode','$payoptname','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="accpayoptions added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="accpayoptions updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="accpayoptions deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add accpayoptions";
        }
     echo json_encode($response); 
});

// sp_accfeequota list
$app->get('/sel_sp_accfeequota',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_accfeequota(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_accfeequota'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_accfeequota', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $feqtId      = $data['feqtId'];
    $feqtcd      = $data['feqtcd'];
    $feqtname    = $data['feqtname'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_accfeequota(0,'$feqtcd','$feqtname','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_accfeequota($feqtId,'$feqtcd','$feqtname','update','$dbnm')";
        }
    else{
            $sql="CALL sp_accfeequota($feqtId,'$feqtcd','$feqtname','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="accfeequota added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="accfeequota updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="accfeequota deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add accfeequota";
        }
     echo json_encode($response); 
});

// sp_acccompany list
$app->get('/sel_sp_acccompany',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_acccompany(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_acccompany'][] = $data;
     }
    echo json_encode($patdt);
});


$app->post('/save_sp_acccompany', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $coid        = $data['coid'];
    $cocd        = $data['cocd'];
    $conm        = $data['conm'];
//    $copnm       = $data['copnm'];
//    $codrno      = $data['codrno'];
//    $cobunm      = $data['cobunm'];
//    $costreet    = $data['costreet'];
//    $coarea      = $data['coarea'];
//    $cocity      = $data['cocity'];
//    $copin       = $data['copin'];
//    $costate     = $data['costate'];
//    $cocountry   = $data['cocountry'];
//    $cotel       = $data['cotel'];
//    $cormk       = $data['cormk'];
//    $cologo      = $data['cologo'];
//    $coemail     = $data['coemail'];
//    $cowebsite   = $data['cowebsite'];
//    $imagepathip = $data['imagepathip'];
//    $comobile    = $data['comobile'];
//    $conmdisp    = $data['conmdisp'];
//    $smsurl      = $data['smsurl'];
//    $lvmobile    = $data['lvmobile'];
//    $prplnm      = $data['prplnm'];
//    $disecode    = $data['disecode'];
//    $cogroup     = $data['cogroup'];
//    $prplsign    = $data['prplsign'];
//    $prplremark  = $data['prplremark'];
    
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_acccompany(0,'$cocd','$conm',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_acccompany($coid,'$cocd','$conm',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'update','$dbnm')";
        }
    else{
            $sql="CALL sp_acccompany($coid,'$cocd','$conm',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="acccompany added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="acccompany updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="acccompany deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add acccompany";
        }
     echo json_encode($response); 
});

// sp-marksdetail 
$app->post('/select_sp_marksdetail',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $secid       = $data['secid'];
    $assid       = $data['assid'];
    $asstypeid   = $data['asstypeId'];
    $stuid       = $data['stuid'];
    $sql   = "CALL sp_reportcard(0,0,$stuid,$clid,$secid,$assid,$asstypeid,0,0,0,0,0,0,0,'selbystuid','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['by_sp_marksdetail'][] = $data;
     }
    echo json_encode($response);
    
});


//sp_reportcard list 
$app->post('/select_sp_reportcard',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $secid       = $data['secid'];
    $assid       = $data['assid'];
    $asstypeid   = $data['asstypeId'];
    $subid       = $data['subid'];
    //$stuid       = $data['stuid'];
    $sql   = "CALL sp_reportcard(0,0,0,$clid,$secid,$assid,$asstypeid,$subid,0,0,0,0,0,0,'selbyid','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['by_sp_reportcard'][] = $data;
     }
    echo json_encode($response);
    
});

$app->post('/loop_reportcard', function ($request, $response, $args) use ($app) {
     
    $conn      = adminDb();
    $response  = array();
    $data      = $request->getParsedBody();
    $dbnm      = $data['dbnm'];
    $marks     = $data['loopdata'];
    
    foreach($marks as $mar){
        $rcid=$mar['rcid'];
        $accscore=$mar['accscore'];
        
        updatemarks($rcid,$accscore,$dbnm) ;     
    }
    $response['size']= $marks;
    $response['status']='success';
    $response['message']="reportcard marks updated successfully";
    echo json_encode($response); 
});

function updatemarks($rcid,$accscore,$dbnm){

    $conn  = adminDb();
    $sql="CALL sp_reportcard($rcid,0,0,0,0,0,0,0,0,0,$accscore,0,0,0,'update','$dbnm')";
    $res = mysqli_query($conn,$sql);
    
}

// sel_sp_masassmodel list
$app->post('/select_sp_model',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $subcbid     = $data['subcbid'];
    $assid       = $data['assid'];
    $asstypeid   = $data['asstypeId'];
    $subid       = $data['subid'];
    $sql   = "CALL sp_masassmodel(0,$assid,$clid,$asstypeid,$subid,$subcbid,0,0,'selbyid','$db',0)";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['by_sp_model'][] = $data;
     }
    echo json_encode($response);
    
});

$app->post('/loop_model', function ($request, $response, $args) use ($app) {
     
    $conn      = adminDb();
    $response  = array();
    $data      = $request->getParsedBody();
    $dbnm      = $data['dbnm'];
    $marksmd   = $data['loopdata'];
    
    foreach($marksmd as $marmd){
        $mid=$marmd['mid'];
        $maxscore=$marmd['maxscore'];
        $minscore=$marmd['minscore'];
        
        updatemaxmin($mid,$maxscore,$minscore,$dbnm) ;
    }
   
    $response['size']= $marksmd;
    $response['status']='success';
    $response['message']="masassmodel marks updated successfully";
    echo json_encode($response); 
});

function updatemaxmin($mid,$maxscore,$minscore,$dbnm){

    $conn  = adminDb();
    $sql="CALL sp_masassmodel(0,0,0,0,0,0,$maxscore,$minscore,'update','$dbnm',$mid)";
    $res = mysqli_query($conn,$sql); 
    
}

// sel_sp_accpayoptions list

$app->get('/sel_sp_masclasssubject',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_masclasssubject(0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masclasssubject'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/by_sp_masclasssubject',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $sql   = "CALL sp_masclasssubject($clid,0,'selbyclid','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['by_sp_clsSub'][] = $data;
     }
    echo json_encode($response);
    
});
$app->post('/save_sp_masclasssubject', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $subid       = $data['subid'];
    $oprtag      = $data['oprtag'];
    $dbnm        = "mycplvdev";

    if($oprtag=='insert'){
            $sql="CALL sp_masclasssubject($clid,$subid,'insert','$dbnm')";
        }
    elseif($oprtag=='delete'){
            $sql="CALL sp_masclasssubject($clid,$subid,'delete','$dbnm')";
        }
    else{
            $sql="CALL sp_masclasssubject($clid,$subid,'update','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masclasssubject added successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="masclasssubject deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masclasssubject";
        }
     echo json_encode($response); 
});

// sel_sp_assignment list

$app->get('/sel_sp_assignment',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $response = array();
    $sql   = "CALL sp_homework(0,0,0,0,0,0,0,'$db','selall',0,0)";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['sp_homework'][] = $data;
     }
    echo json_encode($response);
});
$app->post('/by_sp_assignment',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $secid        = $data['secid'];
    $subid        = $data['subid'];
    $sql   = "CALL sp_homework(0,0,$clid,0,$subid,0,0,'$db','selbyclid',0,0)";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['by_sp_agnmtclid'][] = $data;
     }
    
    echo json_encode($response);
    
});
$app->post('/save_sp_assignment', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $hwid        = $data['hwid'];
    $clid        = $data['clid'];
    $subid       = $data['subid'];
    $secid       = $data['secid'];
    $hwdt        = $data['hwdt'];
    $duedt       = $data['duedt'];
    $hwdetails   = $data['hwdetails'];
    $oprtag      = $data['oprtag'];
    $dbnm        = "mycplvdev";

    if($oprtag=='insert'){
            $sql   = "CALL sp_homework(0,0,$clid,$secid,$subid,'$hwdetails',0,'$dbnm','insert','$hwdt','$duedt')";
        }
    elseif($oprtag=='update'){
            $sql   = "CALL sp_homework($hwid,0,$clid,$secid,$subid,'$hwdetails',0,'$dbnm','update','$hwdt','$duedt')";
        }
    else{
            $sql   = "CALL sp_homework($hwid,0,0,0,0,0,0,'$dbnm','delete',0,0)";
        }
    $res = mysqli_query($conn,$sql);
    
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="assignment added successfully";
        }
    
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="assignment updated successfully";
        }
    
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="assignment deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add assignment";
        }
     echo json_encode($response); 
});

// sp_masmot list
$app->get('/sel_sp_masmot',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_masmot(0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masmot'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_masmot', function ($request, $response, $args) use ($app) {
    $dbnm="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data  = $request->getParsedBody();
    $motid = $data['motid'];
    $mot   = $data['mot'];
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
             $sql="CALL sp_masmot(0,'$mot','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
             $sql="CALL sp_masmot($motid,'$mot','update','$dbnm')";
        }
    else{
             $sql="CALL sp_masmot($motid,0,'delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="MoT added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="MoT updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="MoT deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add MoT";
        }
     echo json_encode($response); 
});

// sp_mashouse list
$app->get('/sel_sp_mashouse',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_mashouse(0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_mashouse'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_mashouse', function ($request, $response, $args) use ($app) {
    $dbnm="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data  = $request->getParsedBody();
    $hsid  = $data['hsid'];
    $hsnm   = $data['hsnm'];
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
             $sql="CALL sp_mashouse(0,'$hsnm','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
             $sql="CALL sp_mashouse($hsid,'$hsnm','update','$dbnm')";
        }
    else{
             $sql="CALL sp_mashouse($hsid,0,'delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="house added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="house updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="house deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add house";
        }
     echo json_encode($response); 
});



$app->get('/sel_students/{clid}/{dbnm}/{tag}',function($request, $response, $args){
    $dbnm=$args['dbnm'];
    $clid=$args['clid'];
    $tag=$args['tag'];
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="call sp_studentadmission (0,'0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0',0,0,'0','0','0','0','0','0','0','0','0',0,0,0,'0','0',0,$clid,0,0,'0','0','0',0,'$dbnm','$tag',0)";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_mashouse'][] = $data;
     }
    echo json_encode($patdt);
});





$app->post('/studentadmission', function ($request, $response, $args) use ($app) {
    


    // "stuId":"4","admno":"1234","adayid":"1","doa":"2018-03-14T13:00:00.000Z","name":"Mahableshwar","dob":"2018-03-20T13:00:00.000Z",
    //"gender":"M","bloodgroup":"O+","nationality":"indian","religion":"hindu","caste":"caste","subcaste":"subcaste",
    //"aadharno":"1234","mothertongue":"kannada","category":"OBC","fatname":"manohar","fatedu":null,"fatprofession":"ssds",
    //"fatorg":null,"fatdesig":null,"fatincome":null,"motname":"pushpa","motprofession":"","gdnm":null,
    //"gdrelation":null,"stustatush":"Active","dol":null,"linedt":null,"admclid":"31","slno":null,"enqid":null,
    //"stsno":"123456","rollno":"15","address":"plv technology","city":"Bangalore","pincode":"560094","state":"karnataka",
    //"fatemail":"sdsd@123.com","motemail":"","gardmobile":"","fatmobile":"0123456789","motmobile":"","feqid":"1",
    //"payoptid":"1","mot":"By Cycle","pndid":null,"payopttranid":"3","tpfeeid":null,"rootno":"12","locdist":"5",
    //"lastdt":null,"clid":"41","secid":"1","house":"Green","subcombid":"4","country":"india","class":"GRADE-2",
  //  "oprtag":"update","dbnm":"mycplvdev","routeno":"125"}
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $admno        = $data['admno'];
    $adayid       = $data['adayid'];
    $stuid       = $data['stuId'];
    $enid       = $data['enqid'];

    $doa        = $data['doa'];
    $name       = $data['name'];
    $dob        = $data['dob'];
    $gender       = $data['gender'];
    $bloodgroup        = $data['bloodgroup'];
    $nationality       = $data['nationality'];
    $religion        = $data['religion'];
    $caste       = $data['caste'];


    $subcaste        = $data['subcaste'];
    $aadharno       = $data['aadharno'];
    $mothertongue        = $data['mothertongue'];
    $category       = $data['category'];
    $fatname        = $data['fatname'];
    $fatprofession       = $data['fatprofession'];


    $motname        = $data['motname'];
     $motprofession       = $data['motprofession'];
    $stustatush        = $data['stustatush'];
    $admclid       = $data['admclid'];
    $stsno        = $data['stsno'];
    $rollno       = $data['rollno'];
    $address        = $data['address'];


   
    $city       = $data['city'];
    $pincode        = $data['pincode'];
    $state       = $data['state'];
    $fatemail        = $data['fatemail'];
    $motemail       = $data['motemail'];

    $fatmobile        = $data['fatmobile'];
    $motmobile       = $data['motmobile'];
    $feqid        = $data['feqid'];
    $payoptid       = $data['payoptid'];
    $mot        = $data['mot'];
    $payopttranid       = $data['payopttranid'];


    $rootno        = $data['rootno'];
    $locdist       = $data['locdist'];
    $clid        = $data['clid'];
    $secid       = $data['secid'];
    $house        = $data['house'];
    $subcombid       = $data['subcombid'];
    $country       = $data['country'];

    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];


    

  // $response['message']= $data;



   // call sp_studentadmission (stuid,'admno','doa','name','dob','gender','bgrop','national','reletin','caste','subcaste','aadhar','motongue','category','fatname','fatprof','motname','motprof',admclid,rollno,'stsno','address','city','pincode','state','fatemail','motemail','fatmob','motmob',feqid,payopid,paytrnid,'route','mot',loc,clid,secid,adayid,'stustatus','house','country',subcomb,'dbnm','oprtype')
    if($oprtag=='insert'){
            $sql="call sp_studentadmission ($stuid,'$admno','$doa','$name','$dob','$gender','$bloodgroup','$nationality','$religion','$caste','$subcaste','$aadharno','$mothertongue','$category','$fatname','$fatprofession','$motname','$motprofession',$admclid,$rollno,'$stsno','$address','$city','$pincode','$state','$fatemail','$motemail','$fatmobile','$motmobile',$feqid,$payoptid,$payopttranid,'$rootno','$mot',$locdist,$clid,$secid,$adayid,'$stustatush','$house','$country',$subcombid,'$dbnm','insert',$enid )";
        }
    elseif($oprtag=='update'){
        $sql="call sp_studentadmission ($stuid,'$admno','$doa','$name','$dob','$gender','$bloodgroup','$nationality','$religion','$caste','$subcaste','$aadharno','$mothertongue','$category','$fatname','$fatprofession','$motname','$motprofession',$admclid,$rollno,'$stsno','$address','$city','$pincode','$state','$fatemail','$motemail','$fatmobile','$motmobile',$feqid,$payoptid,$payopttranid,'$rootno','$mot',$locdist,$clid,$secid,$adayid,'$stustatush','$house','$country',$subcombid,'$dbnm','update',$enid )";
        }
    else{
            $sql="CALL sp_masclasssubject($clid,$subid,'update','$dbnm')";
        }


      // $response["message"]=$sql;
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masclasssubject added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="masclasssubject deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masclasssubject";
        }

     echo json_encode($response); 
});



//sp_student

$app->get('/sp_student/{clid}/{secid}/{dbnm}',function($request, $response, $args) use ($app){
    //$db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    //$data        = $request->getParsedBody();
    $dbnm=$args['dbnm'];
    $clid=$args['clid'];
    $clid        = $args['clid'];
    $secid       = $args['secid'];
    $dbnm       = $args['dbnm'];

    $sql   = "CALL sp_student($clid,$secid,0,'$dbnm','selbyclsid')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['by_sp_clsSec'][] = $data;
     }
    echo json_encode($response);
    
});

$app->post('/enquiry', function ($request, $response, $args) use ($app) {
    

   $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $enid        = $data['enid'];
    $endt        = $data['endt'];
    $name       = $data['name'];
    $dob        = $data['dob'];
    $gender       = $data['gender'];
    $caste       = $data['caste'];
    $mothertongue        = $data['mothertoungue'];
   $fatname        = $data['fatname'];
    $fatprofession       = $data['fatprof'];
    $fatemail        = $data['fatemail'];
    $fatmobile        = $data['fatmobile'];
    $fatedu        = $data['fatedu'];
    $motname        = $data['motname'];
     $motprofession       = $data['motprof'];
     $motemail       = $data['motemail'];
         $motmobile       = $data['motmobile'];
         $motedu       = $data['motedu'];
         $gardname       = $data['gardname'];
         $gardrelation       = $data['gardrelation'];
         $gardmobile       = $data['gardmobile'];
         $refname       = $data['refname'];
         $refmobile       = $data['refmobile'];
         $enremarks       = $data['enremarks'];
         $enstatus	       = $data['enstatus'];
    $address        = $data['address'];
    $preinstitute        = $data['preinstitute'];
    $inplace        = $data['inplace'];
    $preacscore        = $data['preacscore'];
  $clid        = $data['clid'];
   $oprtag      = $data['oprtag'];
   $dbnm        = $data['dbnm'];
   $city        = $data['city'];
   $state        = $data['state'];
   $country        = $data['country'];
   $pincode        = $data['pincode'];


// $conn        = adminDb();
// $response    = array();
// $data        = $request->getParsedBody();
// $enid        = $data['enid'];
// $endt        = $data['endt'];
// $name       = $data['enname'];
// $dob        = $data['endob'];
// $gender       = $data['engender'];
// $caste       = $data['encaste'];
// $mothertongue        = $data['enmothertongue'];
// $fatname        = $data['enfatname'];
// $fatprofession       = $data['enfatprof'];
// $fatemail        = $data['enfatemail'];
// $fatmobile        = $data['enfatmobile'];
// $fatedu        = $data['enfatedu'];
// $motname        = $data['enmotname'];
//  $motprofession       = $data['enmotprof'];
//  $motemail       = $data['enmotemail'];
//      $motmobile       = $data['enmotmobile'];
//      $motedu       = $data['enmotedu'];
//      $gardname       = $data['engardname'];
//      $gardrelation       = $data['engardrelation'];
//      $gardmobile       = $data['engardmobile'];
//      $refname       = $data['enrefname'];
//      $refmobile       = $data['enrefmobile'];
//      $enremarks       = $data['enremarks'];
//      $enstatus	       = $data['enstatus'];
// $address        = $data['enaddress'];
// $preinstitute        = $data['enpreinstitute'];
// $inplace        = $data['eninplace'];
// $preacscore        = $data['enpreacscore'];
// $clid        = $data['enclid'];
// $oprtag      = $data['oprtag'];
// $dbnm        = $data['dbnm'];
    

  // $response['message']= $data;



  
    if($oprtag=='insert'){
             $sql="call sp_enquiry ($enid,0,'$endt','$name','$dob','$gender',$clid,'$preinstitute','$inplace','$preacscore','$fatname','$fatedu','$fatprofession','$fatmobile','$fatemail','$motname','$motedu','$motprofession','$motmobile','$motemail','$gardname','$gardrelation','$gardmobile','$mothertongue','$address','$caste','$refname','$refmobile','$enstatus','$enremarks','$dbnm','insert','$city','$state','$country','$pincode')";
        }
    elseif($oprtag=='update'){
        $sql="call sp_enquiry ($enid,0,'$endt','$name','$dob','$gender',$clid,'$preinstitute','$inplace','$preacscore','$fatname','$fatedu','$fatprofession','$fatmobile','$fatemail','$motname','$motedu','$motprofession','$motmobile','$motemail','$gardname','$gardrelation','$gardmobile','$mothertongue','$address','$caste','$refname','$refmobile','$enstatus','$enremarks','$dbnm','update','$city','$state','$country','$pincode')";
        }
    else{
            $sql="CALL sp_masclasssubject($clid,$subid,'update','$dbnm')";
        }


     // $response["message"]=$sql;
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masclasssubject added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="Details updated successfully..";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masclasssubject";
        }

     echo json_encode($response); 
});

$app->get('/selenquiry/{dbnm}',function($request, $response, $args) use ($app){
    //$db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    //$data        = $request->getParsedBody();
    $dbnm=$args['dbnm'];
   // $clid=$args['clid'];
    

   $sql="call sp_enquiry (0,0,'','','','','','','','','','','','','','','','','','','','','','','','','','','','','$dbnm','selall','','','','')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['enquiry'][] = $data;
     }
    echo json_encode($response);
    
});



// $app->post('/upfile',function ($request, $response, $args) use ($app){
//     require_once('db.php');  
//     $response = array();

//     if (!isset($_SESSION)) {
//         session_start();
//     }
    
//     $clcd=$_SESSION['clcd']; 
   
//     $data        = $request->getParsedBody();


//     if(isset($_FILES['file']['name'])) {
        
       
//         $temp = explode(".", $_FILES["file"]["name"][0]);
//         $newfilename = $data['stuid']  . "." . end($temp);
        
//        $target_path1 = "../images/Documents/".$clcd."/"."Studentphoto/";
//           $docpurpose=$data['docpurpose'];
//          if ($docpurpose=="Studentphoto")
//          {
//             $target_path1 = "../images/Documents/".$clcd."/"."Studentphoto/";

//          }
//             else{

//                 $target_path1 = "../images/other/photo/";
//             }
      
//          $target_path = $target_path1 . $newfilename; 
//          $target_path2="api/images/staffs/photo/";
//          $target_path2 = $target_path2 . $newfilename; 
//          $response['status']=$target_path1;
//          if (!file_exists($target_path1)) {
//             mkdir($target_path1, 0777, true);
//         }
//          if(move_uploaded_file($_FILES['file']['tmp_name'][0], $target_path)) {

//             updatestudocstodb((int)$data['stuid'],$docpurpose,$target_path);
//             $response['status'] =$clcd;
//              $response['message'] = "The file 
//               has been uploaded";
//          } else {
//              $response['message'] = "There was an error uploading the file, please try again!";
//          }
//     //    $response['status'] =$target_path1;
//     //    $response['message']="test";
        
//      } else 
//      {
//         $response['status'] ="Error!";
//         $response['message']="Invalidfile, please try again!";
// }
   
       

//         echo json_encode( $response); 
// });

$app->post('/upfile',function ($request, $response, $args) use ($app){
    require_once('db.php');  
    $response = array();
    //$r = json_decode($app->request->getBody());
    $data        = $request->getParsedBody();


    if(isset($_FILES['file']['name'])) {
        
        //  $response['status']="error";
        //  $response['message']="Encountered an error: while uploading. no FILE UPLOADED";
    // } else if ($_FILES['file']['error']==0) {
        $temp = explode(".", $_FILES["file"]["name"][0]);
        $newfilename = $data['stuid']  . "." . end($temp);
         //$newfilename = "testfile.jpg";
         $target_path1 = "../images/staffs/photo/";
          $docpurpose=$data['docpurpose'];
         if ($docpurpose=="Studentphoto")
         {
            $target_path1 = "../images/SP/Studentphoto/";

         }
            else{

                $target_path1 = "../images/staffs/photo/";
            }
       // $target_path1 = "../images/staffs/photo/";
         $target_path = $target_path1 . $newfilename; 
         $target_path2="api/images/staffs/photo/";
         $target_path2 = $target_path2 . $newfilename; 
         $response['status']=$docpurpose;
         if (!file_exists($target_path1)) {
            mkdir($target_path1, 0777, true);
        }
         if(move_uploaded_file($_FILES['file']['tmp_name'][0], $target_path)) {

            updatestudocstodb((int)$data['stuid'],$docpurpose,$target_path);
            $response['status'] ="Success";
             $response['message'] = "The file 
              has been uploaded";
         } else {
             $response['message'] = "There was an error uploading the file, please try again!";
         }
        
     } else 
     {
        $response['status'] ="Error!";
        $response['message']="Invalidfile, please try again!";
}
   
       

        echo json_encode( $response); 
});


function updatestudocstodb($stuid,$docpurpose,$docpath)
{
    $conn        = adminDb();
    $response    = array();
    //$data        = $request->getParsedBody();
    $dbnm="mycplvdev";
   // $clid=$args['clid'];
    

   $sql="call sp_studocuments ($stuid,'$docpurpose','$docpath','$dbnm','insert')";
    $result= mysqli_query($conn,$sql) ;

}


$app->get('/selstudocuments/{stuid}',function($request, $response, $args) use ($app){
    //$db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    //$data        = $request->getParsedBody();
   // $dbnm=$args['dbnm'];
    $stuid=$args['stuid'];
   $dbnm="mycplvdev";

   $sql="call sp_studocuments ($stuid,'','','$dbnm','selbyid')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['studocs'][] = $data;
     }
    echo json_encode($response);
    
});

// sel_sp_attendance list

//$app->get('/sel_sp_clmattendance',function($request, $response, $args){
//    $db    = "mycplvdev";
//    //$conn  = getConnection("mycadmin");
//    $conn        = adminDb();
//    $list  = array();
//    $response = array();
//    $sql   = "CALL sp_clmattendance(0,0,0,0,0,0,0,0,0,0,0,0,0,0,'selall','$db')";
//    $result= mysqli_query($conn,$sql) ;
//     while($data = mysqli_fetch_assoc($result)) {
//         $response['spclmattendance'][] = $data;
//     }
//   // $response[]=$result;
//    echo json_encode($response);
//});

$app->post('/by_sp_clmattendance',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $res=array();
    
    $response['byclmattendance']=array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $secid       = $data['secid'];
    $attdt       = $data['attdt'];
    //$data['attdt']
    
    $sql   = "CALL sp_clmattendance(0,$clid,$secid,0,0,'$attdt',0,0,0,0,0,0,0,0,'selbyclid','$db')";
    $result= mysqli_query($conn,$sql) ;
    $res['details']=array();
     while($data = mysqli_fetch_assoc($result)) {
         
         $arr['attstatus']=(boolean)$data['attstatus'];
         $arr['attstatusaf']=(boolean)$data['attstatusaf'];
         $arr['rollno']=$data['rollno'];
         $arr['name']=$data['name'];
         $arr['stuid']=$data['stuid'];
         $arr['attrmk']=$data['attrmk'];
         array_push($response['byclmattendance'],$arr);
        //  array_push($response['byclmattendance'],$res);
     }
    echo json_encode($response);

});
$app->post('/loop_attendance', function ($request, $response, $args) use ($app) {
     
    $response  = array();
    $data      = $request->getParsedBody();
    $marksmd   = $data['loopdata'];
    
    foreach($marksmd as $marmd){
        $stuid=$marmd['stuid'];
        $attrmk=$marmd['attrmk'];
        $attstatus=$marmd['attstatus'];
        $attstatusaf=$marmd['attstatusaf'];
        $attdt=$marmd['attdt'];
        $dbnm=$marmd['dbnm'];
        
        updateatt($stuid, $attdt, $attrmk, $attstatus, $attstatusaf, $dbnm) ;
    }
    $response['size']= $marksmd;
    $response['status']='success';
    $response['message']="attendance marks updated successfully";
    echo json_encode($response); 
});

function updateatt($stuid, $attdt, $attrmk, $attstatus, $attstatusaf, $dbnm){

    $conn  = adminDb();
    $dbnm      = $data['dbnm'];
    $sql   = "CALL sp_clmattendance(0,0,0,$stuid,0,'$attdt','$attstatus','$attrmk',0,0,0,'$attstatusaf',0,0,'update','$dbnm')";
    $res = mysqli_query($conn,$sql); 
    
}

// sel_sp_attendance list
$app->get('/sel_sp_attperiod',function($request, $response, $args){
    $db    = "mycplvdev";
    //$conn  = getConnection("mycadmin");
    $conn        = adminDb();
    $list  = array();
    $response = array();
    $sql   = "CALL sp_clmattendanceperiod(0,0,0,0,0,0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $response['sp_clmattendanceperiod'][] = $data;
     }
   // $response[]=$result;
    echo json_encode($response);
});



$app->post('/by_sp_clmattendanceperiod',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $res=array();
    
    $response['byclmattendanceper']=array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $secid       = $data['secid'];
    $attdt       = $data['attdt'];
    
    $sql   = "CALL sp_clmattendanceperiod(0,$clid,$secid,0,0,0,'$attdt',0,0,0,0,0,'selbyclid','$db')";
    $result= mysqli_query($conn,$sql) ;
    $res['details']=array();
     while($data = mysqli_fetch_assoc($result)) {
         
         $arr['attstatus']=(boolean)$data['attstatus'];
         $arr['rollno']=$data['rollno'];
         $arr['name']=$data['name'];
         $arr['stuid']=$data['stuid'];
         $arr['attrmk']=$data['attrmk'];
         array_push($response['byclmattendanceper'],$arr);
     }
    echo json_encode($response);

});

$app->post('/loop_attendanceperiod', function ($request, $response, $args) use ($app) {
     
    $response  = array();
    $data      = $request->getParsedBody();
    $marksmd   = $data['loopdata'];
    $attdt     = $data['attdt'];
    $dbnm      = $data['dbnm'];
    
    foreach($marksmd as $marmd){
        $stuid=$marmd['stuid'];
        $attrmk=$marmd['attrmk'];
        $attstatus=$marmd['attstatus'];
        $attstat="";
        
        if($attstatus == true){
            $attstat = "1";
        }else{
            $attstat = "0";
        }
        
        updateattper($stuid, $attdt, $attrmk, $attstat, $dbnm) ;
    }
    $response['size']= $marksmd;
    $response['status']='success';
    $response['message']="attendance marks updated successfully";
    echo json_encode($response); 
});

function updateattper($stuid, $attdt, $attrmk, $attstatus, $dbnm){

    $conn  = adminDb();
    $sql   = "CALL sp_clmattendanceperiod(0,0,0,$stuid,0,0,'$attdt','$attstatus','$attrmk',0,0,0,'update','$dbnm')";
    $res = mysqli_query($conn,$sql); 
    
}

$app->post('/saveaccfeechart', function ($request, $response, $args) use ($app) 

{
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $admtypeid        = $data['admtypeid'];
    $feeqtid       = $data['feeqtid'];
    $payoptid        = $data['payoptid'];
    $insid       = $data['insid'];
    $coid       = $data['coid'];
    $accid       = $data['accid'];
    $feeamt       = $data['feeamt'];
    $oprtype       = $data['oprtype'];
    $dbnm       = $data['dbnm'];
    //$response['message']=$data ;
   if($oprtype=='insert'){
    $sql="call sp_accfeechartac (1,$clid ,$feeqtid,$payoptid,$insid ,'',$accid,$feeamt ,$coid,$admtypeid,'$oprtype','$dbnm' )";
}
elseif($oprtype=='update'){
//$sql="call sp_studentadmission ($stuid,'$admno','$doa','$name','$dob','$gender','$bloodgroup','$nationality','$religion','$caste','$subcaste','$aadharno','$mothertongue','$category','$fatname','$fatprofession','$motname','$motprofession',$admclid,$rollno,'$stsno','$address','$city','$pincode','$state','$fatemail','$motemail','$fatmobile','$motmobile',$feqid,$payoptid,$payopttranid,'$rootno','$mot',$locdist,$clid,$secid,$adayid,'$stustatush','$house','$country',$subcombid,'$dbnm','update',$enid )";
}
else{
    //$sql="CALL sp_masclasssubject($clid,$subid,'update','$dbnm')";
}


 // $response["message"]=$sql;
$res = mysqli_query($conn,$sql);
if($oprtype=='insert'){
    $response['status']='success';
    $response['message']="details inserted successfully";
}
elseif($oprtype=='update'){
    $response['status']='success';
    $response['message']="masclasssubject deleted successfully";
}
else{
    $response['status']='error';
    $response['message']="Unable to add masclasssubject";
}
    echo json_encode($response);
});


$app->post('/selaccfeechart',function($request, $response, $args) use ($app){
    $db    = "mycplvdev";
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $clid        = $data['clid'];
    $admtypeid        = $data['asstypeid'];
    $feeqtid       = $data['feeqtid'];
    $payoptid        = $data['payoptid'];
    $insid       = $data['insid'];

    //$response['accfeechartdata']=$data ;
    //$data['attdt']
    
     $sql="call sp_accfeechartac (1,$clid ,$feeqtid,$payoptid,$insid ,'',0,0 ,0,$admtypeid,'selbyids','$db' )";
    $result= mysqli_query($conn,$sql) ;
    //$res['details']=array();
     while($data = mysqli_fetch_assoc($result)) {
        $response['accfeechartdata'][] = $data;
     }
   // $response['accfeechartdata']=$sql ;
    echo json_encode($response);

});



$app->get('/sel_sp_hrmemployee',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmemployee(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmemployee'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_hrmemployee', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    
    $emid        = $data['emid'];
    $emno        = $data['emno'];
    $emnm        = $data['emnm'];
    $dob         = $data['dob'];
    $gender      = $data['gender'];
    $blood       = $data['blood'];
    $pob         = $data['pob'];
    $mtongue     = $data['mtongue'];
    $nationality = $data['nationality'];
    $religion    = $data['religion'];
    $caste       = $data['caste'];
    $subcaste    = $data['subcaste'];
    $edu         = $data['edu'];
    $insid       = $data['insid'];
    $doj         = $data['doj'];
    $desid       = $data['desid'];
    $depid       = $data['depid'];    
    $emcatid     = $data['emcatid'];
    $leid        = $data['leid'];
//    $dol         = $data['dol'];
    $tospeak     = $data['tospeak'];
    $toread      = $data['toread'];
    $towrite     = $data['towrite'];
    $aadhaar     = $data['aadhaar'];
    $pan         = $data['pan'];
    $pf          = $data['pf'];
    $esi         = $data['esi'];
    $insno       = $data['insno'];
    $mobile      = $data['mobile'];
    $email       = $data['email'];
    $acno        = $data['acno'];
    $acnm        = $data['acnm'];
    $bkid        = $data['bkid'];
    $bkbrnm      = $data['bkbrnm'];
    $ifsc        = $data['ifsc'];
    $marital     = $data['marital'];
    $dom         = $data['dom'];
    $fnm         = $data['fnm'];
    $fprof       = $data['fprof'];
    $fmobile     = $data['fmobile'];
    $femail      = $data['femail'];
    $mnm         = $data['mnm'];
    $mprof       = $data['mprof'];
    $mmobile     = $data['mmobile'];
    $memail      = $data['memail'];    
    $snm         = $data['snm'];
    $sprof       = $data['sprof'];
    $smobile     = $data['smobile'];
    $semail      = $data['semail'];
    $gnm         = $data['gnm'];
    $gprof       = $data['gprof'];
    $gmobile     = $data['gmobile'];
    $gemail      = $data['gemail'];    
    $ccountryid  = $data['ccountryid'];
    $cstateid    = $data['cstateid'];
    $cdistrictid = $data['cdistrictid'];
    $ccityid     = $data['ccityid'];
    $clocality   = $data['clocality'];
    $cpin        = $data['cpin'];
    $caddress    = $data['caddress'];
    $clandmark   = $data['clandmark'];
    $pcountryid  = $data['pcountryid'];
    $pstateid    = $data['pstateid'];
    $pdistrictid = $data['pdistrictid'];
    $pcityid     = $data['pcityid'];
    $plocality   = $data['plocality'];
    $ppin        = $data['ppin'];
    $paddress    = $data['paddress'];
    $plandmark   = $data['plandmark'];
    
    
    $statush     = $data['statush'];
    
    $oprtag      = $data['oprtag'];
    $db          = "mycplvdev"; 
    
    //$response['message'] = $data;
    
    if($oprtag=='insert'){
            $sql   = "CALL sp_hrmemployee(0,'$emno','$emnm','$dob','$gender','$blood','$pob','$mtongue','$nationality','$religion','$caste','$subcaste','$edu','$insid','$doj','$desid','$depid','$emcatid','$leid','0','$tospeak','$toread','$towrite','$aadhaar','$pan','$pf','$esi','$insno','$mobile','$email','$acno','$acnm','$bkid','$bkbrnm','$ifsc','$marital','$dom','$fnm','$fprof','$fmobile','$femail','$mnm','$mprof','$mmobile','$memail','$snm','$sprof','$smobile','$semail','$gnm','$gprof','$gmobile','$gemail','$ccountryid','$cstateid','$cdistrictid','$ccityid','$clocality','$cpin','$caddress','$clandmark','$pcountryid','$pstateid','$pdistrictid','$pcityid','$plocality','$ppin','$paddress','$plandmark',0,0,0,'$statush',0,0,0,'insert','$db')";

        }
    elseif($oprtag=='update'){
            $sql   = "CALL sp_hrmemployee($emid,'$emno','$emnm','$dob','$gender','$blood','$pob','$mtongue','$nationality','$religion','$caste','$subcaste','$edu','$insid','$doj','$desid','$depid','$emcatid','$leid','0','$tospeak','$toread','$towrite','$aadhaar','$pan','$pf','$esi','$insno','$mobile','$email','$acno','$acnm','$bkid','$bkbrnm','$ifsc','$marital','$dom','$fnm','$fprof','$fmobile','$femail','$mnm','$mprof','$mmobile','$memail','$snm','$sprof','$smobile','$semail','$gnm','$gprof','$gmobile','$gemail','$ccountryid','$cstateid','$cdistrictid','$ccityid','$clocality','$cpin','$caddress','$clandmark','$pcountryid','$pstateid','$pdistrictid','$pcityid','$plocality','$ppin','$paddress','$plandmark',0,0,0,'$statush',0,0,0,'update','$db')";
 
        }
    elseif($oprtag=='delete'){
            $sql   = "CALL sp_hrmemployee($emid,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'$statush',0,0,0,'delete','$db')";
        }
    
    mysqli_query($conn, $sql);
    $latid = mysqli_fetch_assoc(mysqli_query($conn,"select max(emid) from $db.hrmemployee"));
    
    $lid = $latid["max(emid)"];
    if($oprtag=='insert'){
        
         $prid     = $lid;
    }
    
    else
    {
         $prid     = $emid;
        
    }
        if($oprtag!='delete'){
            //$response['prid.................']=$lid; 
            if($prid!=0){
              //Qualification
                $pqdata   = $data['fieldArray'];  
                foreach($pqdata as $pqd){
                
                $rid      = $pqd['rid'];               
                $corid    = $pqd['corid'];
                $perc     = $pqd['perc'];
                $board    = $pqd['board'];
                $strid    = $pqd['strid'];
                $attempts = $pqd['attempts'];
                $institute= $pqd['institute'];
                $place    = $pqd['place'];
                $medium   = $pqd['medium'];
                $oprtype  = 'update';

                    if($rid == 0)
                    {
                        updpqrid($rid,$prid,$corid,$perc,$board,$strid,$attempts,$institute,$place,$medium,$oprtype,$db);
                    }
                    else
                    {
                       updateprofileq($rid,$prid,$corid,$perc,$board,$strid,$attempts,$institute,$place,$medium,$oprtype,$db) ;
                    }  
                }

            //Experience
                $expdata   = $data['expArray'];  
                foreach($expdata as $ped){

                $rid       = $ped['rid'];
                $institute = $ped['institute'];
                $frdt      = $ped['frdt'];
                $todt      = $ped['todt'];
                $post      = $ped['post'];
                $rmk       = $ped['rmk'];

                    if($rid == 0)
                    {
                       $sql2="CALL sp_hrmprofileex(0,$prid,'$institute','$frdt','$todt','$post','$rmk',0,'insert','$db')";
                       $res = mysqli_query($conn,$sql2); 
                    }
                    else
                    {
                       $sql3="CALL sp_hrmprofileex($rid,$prid,'$institute','$frdt','$todt','$post','$rmk',0,'update','$db')";                  
                       $res = mysqli_query($conn,$sql3); 
                    }  
                }

            //Award
                $awrddata   = $data['awrdArray'];  
                foreach($awrddata as $pawd){

                $rid       = $pawd['rid'];
                $name      = $pawd['name'];
                $year      = $pawd['year'];
                $remark    = $pawd['remark'];
                $tag       = $pawd['tag'];

                    if($rid == 0)
                    {
                       $sql4="CALL sp_hrmaward(0,$prid,'$name','$year','$remark','$tag','insert','$db')";
                       $res = mysqli_query($conn,$sql4); 
                    }
                    else
                    {
                       $sql5="CALL sp_hrmaward($rid,$prid,'$name','$year','$remark','$tag','update','$db')";                
                       $res = mysqli_query($conn,$sql5); 
                    }  
                }

            //Course
                $coursedata   = $data['courseArray'];  
                foreach($coursedata as $pcourse){

                $rid       = $pcourse['rid'];
                $name      = $pcourse['name'];
                $year      = $pcourse['year'];
                $remark    = $pcourse['remark'];
                $tag       = $pcourse['tag'];

                    if($rid == 0)
                    {
                       $sql6="CALL sp_hrmaward(0,$prid,'$name','$year','$remark','$tag','insert','$db')";
                       $res = mysqli_query($conn,$sql6); 
                    }
                    else
                    {
                       $sql7="CALL sp_hrmaward($rid,$prid,'$name','$year','$remark','$tag','update','$db')";                
                       $res = mysqli_query($conn,$sql7); 
                    }  
                }
            }
        }
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="Employee data added successfully";
        }
    
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="Employee data updated successfully";
        }
    
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="Employee data deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add Employee data";
        }
    

     //$response['message']=$sql;
     //$response['lastid']= $latid;
     //echo "New record created successfully. Last inserted ID is: " . $last_id;
     echo json_encode($response); 
    
});

function updateprofileq($rid,$prid,$corid,$perc,$board,$strid,$attempts,$institute,$place,$medium,$oprtype,$db){

    $conn = adminDb();
        $sql   ="CALL sp_hrmprofileq($rid,$prid,'$corid',$perc,'$board','$strid',$attempts,'$institute','$place','$medium',0,0,'update','$db')";
        $res = mysqli_query($conn,$sql); 
}

function updpqrid($rid,$prid,$corid,$perc,$board,$strid,$attempts,$institute,$place,$medium,$oprtype,$db){
    $conn = adminDb();
        $sql    ="CALL sp_hrmprofileq(0,$prid,'$corid',$perc,'$board','$strid',$attempts,'$institute','$place','$medium',0,0,'insert','$db')";
        $res = mysqli_query($conn,$sql);
}
// sp_hrmprofile details

$app->get('/sel_sp_hrmprofile',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmprofile(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmprofile'][] = $data;
     }
    echo json_encode($patdt);
});

// sp_hrmdept details
$app->get('/sel_sp_hrmdept',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmdept(0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmdept'][] = $data;
     }
    echo json_encode($patdt);
});

// sp_hrmdesig details
$app->get('/sel_sp_hrmdesig',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmdesig(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmdesig'][] = $data;
     }
    echo json_encode($patdt);
});

// sp_hrmemcat details
$app->get('/sel_sp_hrmemcat',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmemcat(0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmemcat'][] = $data;
     }
    echo json_encode($patdt);
});

// sp_hrmlevelseg details
$app->get('/sel_sp_hrmlevelseg',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmlevelseg(0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmlevelseg'][] = $data;
     }
    echo json_encode($patdt);
});

// sp_acminstitute details
$app->get('/sel_sp_acminstitute',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $list=array();
    $patdt = array();
    $sql="CALL sp_acminstitute(0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_acminstitute'][] = $data;
     }
    echo json_encode($patdt);
});

// sp_hrmprofileex details
$app->get('/sel_sp_hrmprofileex/{prid}',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $prid = $args['prid'];
    $list=array();
    $patdt = array();
    $sql="CALL sp_hrmprofileex(0,$prid,0,0,0,0,0,0,'selbyid','$db')";
    $result= mysqli_query($conn,$sql) ;
    $rcount= mysqli_num_rows($result);
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_profileex'][] = $data;
     }
    $patdt['rcount']=$rcount;
    echo json_encode($patdt);
});
$app->post('/insdel_sp_hrmprofileex', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data      = $request->getParsedBody();
    $rid       = $data['rid'];
    $prid      = $data['prid'];
    $institute = $data['institute'];
    $frdt      = $data['frdt'];
    $todt      = $data['todt'];
    $post      = $data['post'];
    $rmk       = $data['rmk'];
    
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
        
            $sql="CALL sp_hrmprofileex(0,$prid,0,0,0,0,0,0,'insert','$db')";
        }
    else{           
           $sql="CALL sp_hrmprofileex($rid,0,0,0,0,0,0,0,'delete','$db')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="hrmprofilex added successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="hrmprofilex deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add hrmprofilex";
        }
    
    $response['message'] = $data;
     echo json_encode($response); 
});

// sp_hrmprofileq details
$app->get('/sel_sp_hrmprofileq/{prid}',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $prid = $args['prid'];

    $list=array();
    $patdt = array();
    $atdt = array();
    $sql="CALL sp_hrmprofileq(0,$prid,0,0,0,0,0,0,0,0,0,0,'selbyid','$db')";
    $result= mysqli_query($conn,$sql) ;
    $rcount= mysqli_num_rows($result);
    
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_hrmprofileq'][] = $data;
     }
    $patdt['rcount']=$rcount;
    echo json_encode($patdt);
});

$app->post('/insert_sp_hrmprofileq', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data     = $request->getParsedBody();
    $rid      = $data['rid'];
    $prid     = $data['prid'];
    $corid    = $data['corid'];
    $perc     = $data['perc'];
    $board    = $data['board'];
    $strid    = $data['strid'];
    $attempts = $data['attempts'];
    $institute= $data['institute'];
    $place    = $data['place'];
    $medium   = $data['medium'];
    
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
             $sql="CALL sp_hrmprofileq($rid,$prid,'$corid',$perc,'$board','$strid',$attempts,'$institute','$place','$medium',0,0,'$oprtag','$db')";
        }
    else{
            $sql="CALL sp_hrmprofileq($rid,0,0,0,0,0,0,0,0,0,0,0,'delete','$db')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="hrmprofileq added successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="hrmprofileq deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add hrmprofileq";
        }
    
    $response['message'] = $data;
     echo json_encode($response); 
});


// sp_hrmaward details
$app->get('/sel_sp_hrmaward/{prid}/{tag}',function($request, $response, $args){
    $db="mycplvdev";
    $conn = getConnection("mycadmin");
    $prid = $args['prid'];
    $tag  = $args['tag'];

    $list=array();
    $awarddt = array();
    $atdt = array();
    $sql="CALL sp_hrmaward(0,$prid,0,0,0,'$tag','selbyid','$db')";
    $result= mysqli_query($conn,$sql) ;
    $rcount= mysqli_num_rows($result);
    
     while($data = mysqli_fetch_assoc($result)) {
         $awarddt['sp_hrmaward'][] = $data;
     }
    $awarddt['rcount']=$rcount;
    echo json_encode($awarddt);
});
$app->post('/insdel_sp_hrmaward', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    $conn=adminDb();
    
    $response=array();
    $data     = $request->getParsedBody();
    $rid      = $data['rid'];
    $prid     = $data['prid'];
    $name      = $data['name'];
    $year      = $data['year'];
    $remark    = $data['remark'];
    $tag       = $data['tag'];
    
    $oprtag = $data['oprtag'];

    if($oprtag=='insert'){
             $sql="CALL sp_hrmaward(0,$prid,'$name','$year','$remark','$tag','insert','$db')";
        }
    else{
            $sql="CALL sp_hrmaward($rid,0,0,0,0,0,'delete','$db')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="hrmaward added successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="hrmaward deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add hrmaward";
        }
    
    $response['message'] = $data;
     echo json_encode($response); 
});




$app->get('/acreceipth/{stuid}/{deptid}/{dbnm}',function($request, $response, $args){
    $dbnm=$args['dbnm'];
    $clid=$args['stuid'];
    $deptid=$args['deptid'];
   
    $conn = getConnection($dbnm);
    $list=array();
    $patdt = array();
    $sql="call sp_getaccreceipt ($clid,$deptid,0,'rhead')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['rechead'][] = $data;
     }
    //$patdt['rechead']=$sql;
    echo json_encode($patdt);
});



$app->get('/acreceiptd/{stuid}/{deptid}/{insid}/{dbnm}',function($request, $response, $args){
    $dbnm=$args['dbnm'];
    $clid=$args['stuid'];
    $deptid=$args['deptid'];
    $insid=$args['insid'];
   
    $conn = getConnection($dbnm);
    $list=array();
    $patdt = array();
    $sql="call sp_getaccreceipt ($clid,$deptid,$insid,'rdet')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['recdet'][] = $data;
     }
    //$patdt['rechead']=$sql;
    echo json_encode($patdt);
});


$app->post('/save_accreceiptd', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    
    $response=array();
    $data     = $request->getParsedBody();
    $RecNo      = $data['RecNo'];
    $AccId     = $data['AccId'];
    $RecAmt      = $data['RecAmt'];
    $dbnm      = $data['dbnm'];
   
    $conn = getConnection($dbnm);
    
    $sql="call sp_accreceiptd ($RecNo,$AccId,$RecAmt,'rdet')";
    $result= mysqli_query($conn,$sql) ;
    $response['status']='success';
    $response['message']="Details Updated successfully";
    //$patdt['rechead']=$sql;
    echo json_encode($response);
});

$app->post('/save_Partreceipt', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    
    $response=array();
    $data     = $request->getParsedBody();
    $RecNo      = $data['recno'];
    $stuid     = $data['stuid'];
    $RecAmt      = $data['RecAmt'];
    $dbnm      = $data['dbnm'];
    $mor      = $data['mor'];
    $cqdt      = $data['cqdt'];
    $cqno      = $data['cqno'];
    $bknm      = $data['bknm'];
    $ifsc      = $data['ifsc'];
    $recdt      = $data['recdt'];
    $deptid     = $data['deptid'];
    $insid     = $data['insid'];
   
    $conn = getConnection($dbnm);
    
    $sql="call sp_accreceipt ($stuid,$deptid,$insid,'$mor','$cqno','$cqdt','$bknm','$ifsc','$recdt' ,0,0,$RecAmt)";
    $result= mysqli_query($conn,$sql) ;
    $response['status']='success';
    $response['message']="Details Updated successfully";
    //$patdt['rechead']=$sql;
   //$response['message']=$sql;
    echo json_encode($response);
});


$app->get('/getinvitems/{dbnm}',function($request, $response, $args){
    $dbnm=$args['dbnm'];
    // $clid=$args['stuid'];
    // $deptid=$args['deptid'];
    // $insid=$args['insid'];
   
    $conn=adminDb();
    $list=array();
    $patdt = array();
    $sql="call sp_invitems (0,0,0,0,0,0,'$dbnm','select')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['invitems'][] = $data;
     }
    //$patdt['rechead']=$sql;
    echo json_encode($patdt);
});

$app->get('/getitemgrp/{dbnm}',function($request, $response, $args){
    $dbnm=$args['dbnm'];
    // $clid=$args['stuid'];
    // $deptid=$args['deptid'];
    // $insid=$args['insid'];
   
    $conn=adminDb();
    $list=array();
    $patdt = array();
    $sql="call sp_invitems (0,0,0,0,0,0,'$dbnm','selgrp')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['itmgrp'][] = $data;
     }
    //$patdt['rechead']=$sql;
    echo json_encode($patdt);
});


$app->post('/save_items', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    
    $response=array();
    $data     = $request->getParsedBody();
    $icode      = $data['icode'];
    $iname     = $data['iname'];
    $uom      = $data['uom'];
    $msp      = $data['msp'];
    $ig01      = $data['ig01'];
    $pksize      = $data['pksize'];
    
    $dbnm     = $data['dbnm'];
    $oprtype     = $data['oprtag'];
    if ($msp=="")
    {
        $msp=0;
    }
        
    if ($pksize=="")
    {
        $pksize=0;
    }
   
    $conn=adminDb();
    
    //$sql="call sp_accreceipt ($stuid,$deptid,$insid,'$mor','$cqno','$cqdt','$bknm','$ifsc','$recdt' ,0,0,$RecAmt)";
    $sql="call sp_invitems ($icode,'$iname','$uom',$pksize,$msp,'$ig01','$dbnm','$oprtype')";
    $result= mysqli_query($conn,$sql) ;
//     $response['status']='success';
//    $response['message']="Details Updated successfully";

if( $oprtype=='insert'){
    $response['status']='success';
    $response['message']="Details added successfully";
}
elseif( $oprtype=='delete'){
    $response['status']='success';
    $response['message']= "Details deleted successfully";
}
elseif( $oprtype=='update'){
    $response['status']='success';
    $response['message']="Details updated successfully";
}
else{
    $response['status']='error';
    $response['message']="Unable to add hrmaward";
}
    
  // $response['message']=$sql;
    echo json_encode($response);
});







$app->get('/getvendorlst/{dbnm}',function($request, $response, $args){
    $dbnm=$args['dbnm'];
    // $clid=$args['stuid'];
    // $deptid=$args['deptid'];
    // $insid=$args['insid'];
   
    $conn=adminDb();
    $list=array();
    $patdt = array();
    $sql="call sp_invvendor (0,0,0,0,0,0,0,0,0,0,0,0,0,'$dbnm','select')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['vendorlst'][] = $data;
     }
    //$patdt['rechead']=$sql;
    echo json_encode($patdt);
});



$app->post('/save_vendors', function ($request, $response, $args) use ($app) {
    $db="mycplvdev";
    
    $response=array();
    $data     = $request->getParsedBody();
    $vnid      = $data['vnid'];
    $vnname     = $data['vnname'];
    $address      = $data['address'];
    $state      = $data['state'];
    $city      = $data['city'];
    $pincode      = $data['pincode'];

    $country      = $data['country'];
    $telno      = $data['telno'];
    $mobile      = $data['mobile'];
    $email      = $data['email'];
    $website      = $data['website'];
    $remarks      = $data['remarks'];
    $status      = $data['stat'];
    
    $dbnm     = $data['dbnm'];
    $oprtype     = $data['oprtag'];
    
    $conn=adminDb();
    
    //$sql="call sp_accreceipt ($stuid,$deptid,$insid,'$mor','$cqno','$cqdt','$bknm','$ifsc','$recdt' ,0,0,$RecAmt)";
    $sql="call sp_invvendor ($vnid,'$vnname','$address','$state','$city','$pincode','$country','$telno','$mobile','$email','$website','$remarks','$status','$dbnm','$oprtype')";
    $result= mysqli_query($conn,$sql) ;
//     $response['status']='success';
//    $response['message']="Details Updated successfully";

if( $oprtype=='insert'){
    $response['status']='success';
    $response['message']="Details added successfully";
}
elseif( $oprtype=='delete'){
    $response['status']='success';
    $response['message']= "Details deleted successfully";
}
elseif( $oprtype=='update'){
    $response['status']='success';
    $response['message']="Details updated successfully";
}
else{
    $response['status']='error';
    $response['message']="Unable to add details";
}
    
 // $response['message']=$sql;
    echo json_encode($response);
});
















































































































$app->get('/db',function($request, $response, $args){
    // $host="localhost";
    // $user = "root";
    // $pass="";
    $db="mycplvdev";
    $conn = getConnection("mycplvdev");
    $list=array();
   // $conn = mysqli_connect($host,$user,$pass,$db);
    // if($conn){
    //     echo "success";
    // }
    $sql ="select clid,clname,clcode from masclass";
    $result = mysqli_query($conn,$sql) ;
    while($data = mysqli_fetch_assoc($result))
     {
        $list['classdata'][] =  $data;
        
    }
    echo json_encode($list);
});




$app->group('/books', function () use ($app) {
    $app->get('', function ($request, $response, $args) {
        $response = array();
        $db = $this->jwt->dbname;
        $conn = getConnection($db);
        $user = "select * from employee ";
        $exec=mysqli_query($conn , $user) or die(mysqli_error($conn));
        while($row = mysqli_fetch_assoc($exec)){
              $response['users'][] = $row;
        }
        echo json_encode($response);
    });
    $app->post('', function ($request, $response, $args) {
        // Create a new book
    });
    $app->get('/{id:\d+}', function ($request, $response, $args) {
        // Return a single book
    });
    $app->put('/{id:\d+}', function ($request, $response, $args) {
        // Update a book
    });
});



$app->run();

