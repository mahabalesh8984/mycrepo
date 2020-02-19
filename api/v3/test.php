<?php
//require('fpdf181/fpdf.php');
require('fpdf181/rotation.php');


class PDF extends PDF_Rotate
{
function RotatedText($x,$y,$txt,$angle)
{
    //Text rotated around its origin
    $this->Rotate($angle,$x,$y);
    $this->Text($x,$y,$txt);
    $this->Rotate(0);
}

function RotatedImage($file,$x,$y,$w,$h,$angle)
{
    //Image rotated around its upper-left corner
    $this->Rotate($angle,$x,$y);
    $this->Image($file,$x,$y,$w,$h);
    $this->Rotate(0);
}
}

$pdf = new PDF('P','mm',array(105,74));
$pdf->AddPage();
$pdf->SetFont('Arial','B',20);
// $pdf->Image('logosree.png', 0, 0, 100, 120);
 $pdf->Image('logosree.png', 0, 0, -400);
 $pdf->SetY(3);
 $pdf->SetX(22);
//
 $pdf->SetFont('Arial','BI',19);
 $pdf->SetTextColor(212, 65, 241);
 //220,50,50
$pdf->Cell(80,10,'Sree Gurukul');
// $pdf->Ln(10);


$pdf->SetY(9);
$pdf->SetX(23);
//
$pdf->SetFont('Arial','B',12);
$pdf->SetTextColor(125,50,50);
$pdf->Cell(60,10,'Primary & Highschool');

$pdf->SetY(15);
$pdf->SetX(12);
//
$pdf->SetFont('Arial','B',10);
$pdf->SetTextColor(125,50,50);
$pdf->Cell(60,10,'Siddarameshwara Extn.,2nd Block,');
$pdf->SetY(18);
$pdf->SetX(15);

$pdf->SetFont('Arial','B',10);
$pdf->SetTextColor(125,100,50);
$pdf->Cell(60,10,'2nd Cross,Batwadi, Tumkur-03');


$pdf->SetY(21);
$pdf->SetX(17);
//
$pdf->SetFont('Arial','B',10);
$pdf->SetTextColor(125,100,75);
$pdf->Cell(60,10,'Ph-9986041068,8747800029');
// $pdf->Ln(20);
// $pdf->Cell(40,10,'Hello vinay');
 $pdf->Ln(2);
//  $pdf->SetY(25);
//  $pdf->SetX(19);
$pdf->Image('./SG/8.jpg',22, 28, 30, 40);
//$pdf->Ln(20);
$pdf->SetFont('Arial','B',14);
$pdf->SetTextColor(241, 149, 19);
$pdf->RotatedText(60,60,'Grade-10',90);

// $pdf->SetY(42);
// $pdf->SetX(19);
//
$pdf->Ln(43);
$pdf->SetFont('Arial','',14);
$pdf->SetTextColor(238, 14, 14);
$pdf->Cell(0,10,'Rahul M Belaguli',0,0,'C');


$pdf->Ln(8);
$pdf->SetFont('Arial','',12);
$pdf->SetTextColor(24,23,23);
$pdf->Cell(0,6,'Reg.No.:2018SG01',0,0,'L');

$pdf->Ln(4);
$pdf->SetFont('Arial','',12);
$pdf->SetTextColor(24,23,23);
$pdf->Cell(0,6,'D.O.B:15/03/2018',0,0,'L');

$pdf->Image('samplebar.jpg',12, 90, 50, 10);

$pdf->Image('bldrop.png',12, 43, 5, 6);

// $pdf->Ln(4);
// $pdf->SetFont('Arial','',12);
// $pdf->SetTextColor(24,23,23);
// $pdf->Cell(0,6,'D.O.B:15/03/2018',0,0,'L');

$pdf->Output();
?>