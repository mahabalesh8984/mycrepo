<?php
//require('fpdf181/fpdf.php');
require('./v3/fpdf181/rotation.php');


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

function Footer()
{
    // Position at 1.5 cm from bottom
    $this->SetY(-20);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Page number
    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
}
}

$pdf = new PDF('P','mm','A4');
//$pdf->Line(10,50,200,50);
$pdf->AddPage();
$pdf->Line(5,5,205,5);
$pdf->Line(205,5,205,290);
$pdf->Line(5,5,5,290);
$pdf->Line(205,290,5,290);
$pdf->SetFont('Arial','B',20);
// $pdf->Image('logosree.png', 0, 0, 100, 120);

 $pdf->Image('logosree.png',10,10, -200);
 $pdf->SetY(10);
 $pdf->SetX(75  );
 
 $pdf->SetFont('Arial','B',14);
 $pdf->SetTextColor(50, 50, 50);
 //220,50,50
$pdf->Cell(100,16,'S B R E SOCIETY (R)');
//$pdf->SetLineWidth(1);
// $pdf->Ln(10);


$pdf->SetY(20);
$pdf->SetX(75);
// //
$pdf->SetFont('Arial','',12);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Montesorry Primary & Highschool');

$pdf->SetY(25);
$pdf->SetX(75);
// //
$pdf->SetFont('Arial','',12);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'2nd Cross, 2nd Block,  Siddarameshwara Extension,Batawadi');

$pdf->SetY(30);
$pdf->SetX(75);
// //
$pdf->SetFont('Arial','',12);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'TUMKUR-572103');

$pdf->SetY(35);
$pdf->SetX(75);
// //
$pdf->SetFont('Arial','',12);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'KARNATAKA');
$pdf->Line(5,50,205,50);

$pdf->SetY(50);
$pdf->SetX(75);
// //
$pdf->SetFont('Arial','B',12);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Preliminary Enquiry Form');
$pdf->Line(5,60,205,60);

$pdf->SetY(62);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Class to which admission is sought :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Ward Name :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'DOB :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Gender :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Area :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Mother Tounge : ');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Cast :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Previous School Name :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Place of previous School :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Grade or %Obtained :');


$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Father Name :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Father Mob No  :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Qualification :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Proffesion :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Mother Name :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Mother Mob No :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Qualification :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Proffession :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Guardian :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Guardian Mob No : ');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Relationship with Guardian :');

$pdf->Ln(6);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',11);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Remark :');
$pdf->Line(5,230,205,230);

$pdf->SetY(230);
$pdf->SetX(8);
// //
$pdf->SetFont('Arial','B',9);
$pdf->SetTextColor(50,50,50);
$pdf->MultiCell(180,5,'We certify that the above statements are true and complete to the best of our knowledge and 
authourize Sree Gurukul administration to verify and clarify from anyone concerned. We agree to abide by all the rules and regulations of the institution.
');

$pdf->Line(5,250,205,250);


$pdf->SetY(265);
$pdf->SetX(10);
// //
$pdf->SetFont('Arial','B',10);
$pdf->SetTextColor(50,50,50);
$pdf->Cell(60,10,'Date :');

$pdf->Output();
?>