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
    $sql ="select * from menus where active='Yes'";
    $result = mysqli_query($conn,$sql) ;
    while($data = mysqli_fetch_assoc($result)) {
        $thisref = &$refs[ $data['mid'] ];
        $thisref['mnm'] = $data['mnm'];
        $thisref['url'] = $data['url'];
        $thisref['icon'] = $data['icon'];
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
    $db="mycplvdev";
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

// sel_sp_masassmodel list
$app->get('/sel_sp_masassmodel',function($request, $response, $args){
    $db    = "mycplvdev";
    $conn  = getConnection("mycadmin");
    $list  = array();
    $patdt = array();
    $sql   = "CALL sp_masassmodel(0,0,0,0,0,0,0,0,'selall','$db')";
    $result= mysqli_query($conn,$sql) ;
     while($data = mysqli_fetch_assoc($result)) {
         $patdt['sp_masassmodel'][] = $data;
     }
    echo json_encode($patdt);
});

$app->post('/save_sp_masassmodel', function ($request, $response, $args) use ($app) {
    
    $conn        = adminDb();
    $response    = array();
    $data        = $request->getParsedBody();
    $ayid        = $data['ayid'];
    $assid       = $data['assid'];
    $clid        = $data['clid'];
    $asstypeid   = $data['asstypeid'];
    $subid       = $data['subid'];
    $subcbid     = $data['subcbid'];
    $maxscore    = $data['maxscore'];
    $minscore    = $data['minscore'];
    $oprtag      = $data['oprtag'];
    $dbnm        = $data['dbnm'];

    if($oprtag=='insert'){
            $sql="CALL sp_masassmodel($ayid,$assid,$clid,$asstypeid,$subid,$subcbid,'$maxscore','$minscore','insert','$dbnm')";
        }
    elseif($oprtag=='update'){
            $sql="CALL sp_masassmodel($ayid,$assid,$clid,$asstypeid,$subid,$subcbid,'$maxscore','$minscore','update','$dbnm')";
        }
    else{
            $sql="CALL sp_masassmodel($ayid,$assid,$clid,$asstypeid,$subid,$subcbid,'$maxscore','$minscore','delete','$dbnm')";
        }
    $res = mysqli_query($conn,$sql);
    if($oprtag=='insert'){
            $response['status']='success';
            $response['message']="masassmodel added successfully";
        }
    elseif($oprtag=='update'){
            $response['status']='success';
            $response['message']="masassmodel updated successfully";
        }
    elseif($oprtag=='delete'){
            $response['status']='success';
            $response['message']="masassmodel deleted successfully";
        }
    else{
            $response['status']='error';
            $response['message']="Unable to add masassmodel";
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

